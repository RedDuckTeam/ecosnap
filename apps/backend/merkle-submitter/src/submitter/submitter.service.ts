import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { ComputeBudgetProgram, PublicKey, sendAndConfirmTransaction, Transaction } from '@solana/web3.js';
import { DataSource, Equal, IsNull, Not, Or } from 'typeorm';
import { StorageService } from '@gc/storage';
import { File, GarbageCollect, MerkleSubmission, MerkleTreeType } from '@gc/database-gc';
import { getMerkleProof, getMerkleRoot, getMerkleTree } from '@metaplex-foundation/js';
import * as borsh from 'borsh';
import crypto from 'crypto';

import { ProvidersService } from '@gc/providers';

@Injectable()
export class SubmitterService {
  constructor(
    private readonly logger: Logger,
    private readonly dataSource: DataSource,
    private readonly storageService: StorageService,
    private readonly providerService: ProvidersService
  ) {}

  async process() {
    const resGc = await this.handleGcSubmission();
    const merkleRepo = this.dataSource.getRepository(MerkleSubmission);

    const allResults = [resGc];

    if (!allResults.map((v) => v.submissions).flat().length || !allResults.map((v) => v.toSave).flat().length) {
      this.logger.debug('Nothing to submit, skipping iteration');
      return;
    }

    const merkleRootsToSubmit = [...resGc.submissions].map((v) => ({
      id: v.id,
      rootHash: v.rootHash,
    }));

    const filesToUpload = [...resGc.submissions].map((v) => ({
      id: v.id,
      fileContent: v.fileContent,
    }));

    const files = await this.uploadTreeFiles(filesToUpload);
    const sumbitTx = await this.submitMerkleProofsOnchain(merkleRootsToSubmit);

    await this.dataSource.manager.transaction(async (manager) => {
      for (let res of allResults) {
        if (!res.submissions.length || !res.toSave.length) continue;

        const submissions = await manager.save(
          res.submissions.map((v) => {
            return merkleRepo.create({
              id: v.id,
              merkleRootHash: v.rootHash,
              submissionTxHash: sumbitTx,
              treeType: v.treeType,
              treeFile: files.find((f) => f.id === v.id),
            });
          })
        );

        res.toSave.forEach((v) => {
          v.merkleSubmissions = submissions;
          v.merkleSubmitted = true;
        });

        await manager.save(res.toSave);
      }
    });
  }

  async uploadTreeFiles(files: { id: string; fileContent: string }[]) {
    const fileRepo = this.dataSource.getRepository(File);

    const uploadedFiles: File[] = [];

    for (let file of files) {
      const contentHash = crypto.createHash('sha256').update(file.fileContent).digest('hex');
      const entity = await fileRepo.save(
        fileRepo.create({
          id: file.id,
          contentHash: contentHash,
          fileExtension: 'json',
          remoteStorageId: await this.storageService.writeFile({
            id: file.id,
            content: Buffer.from(file.fileContent),
            extension: 'json',
          }),
        })
      );

      uploadedFiles.push(entity);
    }

    return uploadedFiles;
  }

  async submitMerkleProofsOnchain(proofs: { id: string; rootHash: string }[]) {
    const { program, globalState } = this.providerService.getPrograms().merkleSubmitter;

    const { keypair } = this.providerService.getSolSigner();

    const tx = new Transaction();

    for (let { id, rootHash } of proofs) {
      const idBytes = this.toBinaryUUID(id);

      const [rootPDA] = PublicKey.findProgramAddressSync(
        [Buffer.from('root_state'), globalState.toBuffer(), idBytes],
        program.programId
      );

      tx.add(
        await program.methods
          .newRoot(Array.from(idBytes), Array.from(Buffer.from(rootHash, 'hex')))
          .accounts({
            authority: keypair.publicKey,
            globalState: globalState,
            rootState: rootPDA,
          })
          .signers([keypair])
          .instruction()
      );
    }

    tx.add(
      ComputeBudgetProgram.setComputeUnitPrice({
        microLamports: await this.providerService.getPriorityRate(),
      }),
      ComputeBudgetProgram.setComputeUnitLimit({ units: 100_000 })
    );

    const txSignature = await sendAndConfirmTransaction(program.provider.connection, tx, [keypair], {});

    console.log({ txSignature });
    return txSignature;
  }

  async handleGcSubmission() {
    const gcRepo = this.dataSource.getRepository(GarbageCollect);
    const merkleRepo = this.dataSource.getRepository(MerkleSubmission);

    const garbageCollectToBatch = await gcRepo.find({
      where: {
        pointsGiven: Not(Or(IsNull(), Equal(0))),
        merkleSubmitted: false,
      },
      relations: {
        files: true,
        daoVotes: true,
      },
    });

    if (!garbageCollectToBatch.length) return { submissions: [], toSave: [] };

    const treeData = await this.generateTreeDataForGc(garbageCollectToBatch);

    const submissions = [
      {
        rootHash: treeData.fullTree.rootHash,
        id: crypto.randomUUID(),
        treeType: MerkleTreeType.FULL,
        fileContent: JSON.stringify(treeData.fullTree),
      },
      {
        rootHash: treeData.rewardsClaimTree.rootHash,
        id: crypto.randomUUID(),
        treeType: MerkleTreeType.ONLY_PROOFS,
        fileContent: JSON.stringify(treeData.rewardsClaimTree),
      },
    ];

    return {
      submissions: submissions,
      toSave: garbageCollectToBatch,
    };
  }

  async generateTreeDataForGc(gcs: GarbageCollect[]) {
    const prevRootHash = Buffer.from(''); // FIXME
    const prevRootHex = prevRootHash.toString('hex');

    const leafs = gcs.map((gc) => ({
      files: gc.files.map((f) => ({ hash: f.contentHash, id: f.remoteStorageId })),
      user: gc.user.pubKey.toBase58(),
      votes: gc.daoVotes.map((v) => ({
        signature: v.voteSignature,
        direction: v.voteDirection,
        voter: v.voter.pubKey.toBase58(),
      })),
      pointsGiven: gc.pointsGiven ?? 0,
    }));

    const leafsPerUser: Record<string, number> = {};

    leafs.forEach((v) => {
      if (!leafsPerUser[v.user]) {
        leafsPerUser[v.user] = 0;
      }

      leafsPerUser[v.user] += v.pointsGiven;
    });

    const claimLeafs = Object.entries(leafsPerUser).map(([user, points]) => ({
      user,
      pointsGiven: points,
    }));

    const leafToEncoded = ({ user, pointsGiven }: { user: string; pointsGiven: number }) => {
      return Buffer.concat([
        new PublicKey(user).toBuffer(),
        // TODO: multiply by 10 ** 9
        borsh.serialize('u128', pointsGiven),
      ]);
    };

    const encodedClaimLeaves = claimLeafs.map(leafToEncoded);
    const claimMerkleTree = getMerkleTree(encodedClaimLeaves);
    const rootClaim = claimMerkleTree.getRoot();
    const claimRootHex = rootClaim.toString('hex');

    const leavesWithPrevRoot = [{ prevRootHash: prevRootHex, claimRootHash: claimRootHex }, ...leafs];
    const encodedLeaves = leavesWithPrevRoot.map((l) => JSON.stringify(l));
    const merkleTree = getMerkleTree(encodedLeaves);
    const root = merkleTree.getRoot();
    const rootHex = root.toString('hex');

    console.log({ rootLength: root.length, rootClaimLength: rootClaim.length });

    return {
      fullTree: {
        rootHash: rootHex,
        prevRootHash: prevRootHex,
        leaves: leavesWithPrevRoot,
      },
      rewardsClaimTree: {
        rootHash: claimRootHex,
        leaves: claimLeafs,
        proofs: Object.fromEntries(claimLeafs.map((v) => [v.user, getMerkleProof(encodedLeaves, leafToEncoded(v))])),
      },
    };
  }

  toBinaryUUID(uuid: string): Buffer {
    const buf = Buffer.from(uuid.replace(/-/g, ''), 'hex');
    return Buffer.concat([buf.slice(6, 8), buf.slice(4, 6), buf.slice(0, 4), buf.slice(8, 16)]);
  }
}
