import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { ComputeBudgetProgram, PublicKey, sendAndConfirmTransaction, Transaction } from '@solana/web3.js';
import { DataSource, Equal, IsNull, Not, Or } from 'typeorm';
import { StorageService } from '@gc/storage';
import {
  File,
  GarbageCollect,
  MerkleProof,
  MerkleSubmission,
  MerkleTreeType,
  SubmissionType,
  User,
  UserAchievement,
} from '@gc/database-gc';
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
    const resAchievements = await this.handleAchievementsSubmission();
    const merkleRepo = this.dataSource.getRepository(MerkleSubmission);
    const userRepo = this.dataSource.getRepository(User);
    const proofsRepo = this.dataSource.getRepository(MerkleProof);

    const allResults = [resGc, resAchievements];
    const allSubmissions = allResults.map((v) => v.submissions).flat();

    if (!allResults.map((v) => v.submissions).flat().length || !allResults.map((v) => v.toSave).flat().length) {
      this.logger.debug('Nothing to submit, skipping iteration');
      return;
    }

    const merkleRootsToSubmit = allSubmissions.map((v) => ({
      id: v.id,
      rootHash: v.rootHash,
    }));

    const filesToUpload = allSubmissions.map((v) => ({
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
              submissionType: v.submissionType,
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

        for (let submission of res.submissions) {
          if (!submission.proofs) continue;

          for (let [userPubKey, proofs] of Object.entries(submission.proofs)) {
            for (let { id, proofs: proof } of proofs) {
              const user = await userRepo.findOneBy({
                pubKey: new PublicKey(userPubKey),
              });

              if (!user) throw new Error('User is not found in db');

              await manager.save(
                proofsRepo.create({
                  user,
                  submission: submissions.find((v) => v.id === submission.id),
                  proof: proof.map((v) => Buffer.from(v)),
                  leaf: submission.leaves.find((v) => v.id === id)!,
                })
              );
            }
          }
        }
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
            content: Buffer.from(file.fileContent),
            id: file.id,
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

    const lastFull = await this.dataSource.manager.getRepository(MerkleSubmission).findOne({
      order: {
        createdAt: 'DESC',
      },
      where: {
        submissionType: SubmissionType.GC,
        treeType: MerkleTreeType.FULL,
        treeFile: Not(IsNull()),
        submissionTxHash: Not(IsNull()),
      },
      relations: {
        treeFile: true,
      },
    });

    const treeData = await this.generateTreeDataForGc(lastFull, garbageCollectToBatch);

    const submissions = [
      {
        rootHash: treeData.fullTree.rootHash,
        id: treeData.fullTree.id,
        leaves: treeData.fullTree.leaves,
        treeType: MerkleTreeType.FULL,
        submissionType: SubmissionType.GC,
        fileContent: JSON.stringify(treeData.fullTree),
      },
      {
        rootHash: treeData.rewardsClaimTree.rootHash,
        id: treeData.rewardsClaimTree.id,
        leaves: treeData.rewardsClaimTree.leaves,
        proofs: treeData.rewardsClaimTree.proofs,
        submissionType: SubmissionType.GC,
        treeType: MerkleTreeType.ONLY_PROOFS,
        fileContent: JSON.stringify(treeData.rewardsClaimTree),
      },
    ];

    return {
      submissions: submissions,
      toSave: garbageCollectToBatch,
    };
  }

  async handleAchievementsSubmission() {
    const achRepo = this.dataSource.getRepository(UserAchievement);
    const merkleRepo = this.dataSource.getRepository(MerkleSubmission);

    const achievementsToBatch = await achRepo.find({
      where: {
        merkleSubmitted: false,
        received: true,
      },
      relations: {
        achievement: true,
      },
    });

    if (!achievementsToBatch.length) return { submissions: [], toSave: [] };

    const lastFull = await this.dataSource.manager.getRepository(MerkleSubmission).findOne({
      order: {
        createdAt: 'DESC',
      },
      where: {
        submissionType: SubmissionType.ACHIEVEMENTS,
        treeType: MerkleTreeType.FULL,
        treeFile: Not(IsNull()),
        submissionTxHash: Not(IsNull()),
      },
      relations: {
        treeFile: true,
      },
    });

    const treeData = await this.generateTreeDataForAchievements(lastFull, achievementsToBatch);

    const submissions = [
      {
        rootHash: treeData.fullTree.rootHash,
        id: treeData.fullTree.id,
        leaves: treeData.fullTree.leaves,
        treeType: MerkleTreeType.FULL,
        submissionType: SubmissionType.ACHIEVEMENTS,
        fileContent: JSON.stringify(treeData.fullTree),
      },
      {
        rootHash: treeData.rewardsClaimTree.rootHash,
        id: treeData.rewardsClaimTree.id,
        leaves: treeData.rewardsClaimTree.leaves,
        proofs: treeData.rewardsClaimTree.proofs,
        treeType: MerkleTreeType.ONLY_PROOFS,
        submissionType: SubmissionType.ACHIEVEMENTS,
        fileContent: JSON.stringify(treeData.rewardsClaimTree),
      },
    ];

    return {
      submissions: submissions,
      toSave: achievementsToBatch,
    };
  }

  async generateTreeDataForGc(prevSubmission: MerkleSubmission | null, gcs: GarbageCollect[]) {
    const prevRootHash = prevSubmission ? Buffer.from(prevSubmission.merkleRootHash) : Buffer.from([]); // FIXME
    const prevRootHex = prevRootHash.toString('hex');

    const treeId = crypto.randomUUID();
    const claimTreeId = crypto.randomUUID();

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

    const claimLeafs = Object.entries(leafsPerUser).map(([user, points], i) => ({
      id: i,
      user,
      pointsGiven: points,
    }));

    const leafToEncoded = ({ user, id, pointsGiven }: { id: number; user: string; pointsGiven: number }) => {
      return Buffer.concat([
        new PublicKey(user).toBuffer(),
        borsh.serialize('u128', id),
        // TODO: multiply by 10 ** 9
        borsh.serialize('u128', pointsGiven),
      ]);
    };

    const encodedClaimLeaves = claimLeafs.map(leafToEncoded);
    const claimMerkleTree = getMerkleTree(encodedClaimLeaves);
    const rootClaim = claimMerkleTree.getRoot();
    const claimRootHex = rootClaim.toString('hex');

    const leavesWithPrevRoot = [
      {
        treeId,
        claimTreeId,
        prevTreeId: prevSubmission?.id ?? '',
        prevRootHash: prevRootHex,
        claimRootHash: claimRootHex,
      },
      ...leafs,
    ];
    const encodedLeaves = leavesWithPrevRoot.map((l) => JSON.stringify(l));
    const merkleTree = getMerkleTree(encodedLeaves);
    const root = merkleTree.getRoot();
    const rootHex = root.toString('hex');

    return {
      fullTree: {
        id: treeId,
        rootHash: rootHex,
        prevRootHash: prevRootHex,
        leaves: leavesWithPrevRoot,
      },
      rewardsClaimTree: {
        id: claimTreeId,
        rootHash: claimRootHex,
        leaves: claimLeafs,
        proofs: Object.fromEntries(
          claimLeafs.map((v) => [v.user, [{ id: v.id, proofs: getMerkleProof(encodedLeaves, leafToEncoded(v)) }]])
        ),
      },
    };
  }

  async generateTreeDataForAchievements(prevSubmission: MerkleSubmission | null, achievements: UserAchievement[]) {
    const prevRootHash = prevSubmission ? Buffer.from(prevSubmission.merkleRootHash) : Buffer.from([]);
    const prevRootHex = prevRootHash.toString('hex');

    const treeId = crypto.randomUUID();
    const claimTreeId = crypto.randomUUID();

    const leafs = achievements.map((ach) => ({
      user: ach.user.pubKey,
      achievement: ach.achievement.id,
      amount: 1,
    }));

    const claimLeafs = leafs.map(({ achievement, amount, user }, i) => ({
      achievementId: achievement,
      id: i,
      user: user.toBase58(),
      amount,
    }));

    const leafToEncoded = ({
      user,
      id,
      achievementId,
      amount,
    }: {
      achievementId: string;
      amount: number;
      id: number;
      user: string;
    }) => {
      return Buffer.concat([
        new PublicKey(user).toBuffer(),
        borsh.serialize('u128', id),
        borsh.serialize('u128', achievementId),
        borsh.serialize('u128', amount),
      ]);
    };

    const encodedClaimLeaves = claimLeafs.map(leafToEncoded);
    const claimMerkleTree = getMerkleTree(encodedClaimLeaves);
    const rootClaim = claimMerkleTree.getRoot();
    const claimRootHex = rootClaim.toString('hex');

    const leavesWithPrevRoot = [
      {
        treeId,
        claimTreeId,
        prevTreeId: prevSubmission?.id ?? '',
        prevRootHash: prevRootHex,
        claimRootHash: claimRootHex,
      },
      ...leafs,
    ];
    const encodedLeaves = leavesWithPrevRoot.map((l) => JSON.stringify(l));
    const merkleTree = getMerkleTree(encodedLeaves);
    const root = merkleTree.getRoot();
    const rootHex = root.toString('hex');

    return {
      fullTree: {
        id: treeId,
        rootHash: rootHex,
        prevRootHash: prevRootHex,
        leaves: leavesWithPrevRoot,
      },
      rewardsClaimTree: {
        id: claimTreeId,

        rootHash: claimRootHex,
        leaves: claimLeafs,
        proofs: Object.fromEntries(
          claimLeafs.map((v) => [v.user, [{ id: v.id, proofs: getMerkleProof(encodedLeaves, leafToEncoded(v)) }]])
        ),
      },
    };
  }

  toBinaryUUID(uuid: string): Buffer {
    const buf = Buffer.from(uuid.replace(/-/g, ''), 'hex');
    return Buffer.concat([buf.slice(6, 8), buf.slice(4, 6), buf.slice(0, 4), buf.slice(8, 16)]);
  }
}
