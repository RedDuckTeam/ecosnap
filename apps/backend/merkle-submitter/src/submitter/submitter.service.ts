import { BadRequestException, Injectable } from '@nestjs/common';
import { PublicKey } from '@solana/web3.js';
import { DataSource } from 'typeorm';
import { StorageService } from '@gc/storage';
import { GarbageCollect } from '@gc/database-gc';
import { getMerkleProof, getMerkleRoot, getMerkleTree } from '@metaplex-foundation/js';
import * as borsh from 'borsh';
import type { Schema } from 'borsh';

@Injectable()
export class SubmitterService {
  constructor(
    private readonly dataSource: DataSource,
    private readonly storageService: StorageService
  ) {}

  async process() {}

  async generateTreeDataForGc(gcs: GarbageCollect[]) {
    const prevRootHash = Buffer.from(''); // FIXME

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
    const encodedLeaves = claimLeafs.map(leafToEncoded);
    const merkleTree = getMerkleTree(encodedLeaves);
    const root = merkleTree.getRoot();

    console.log({ rootLength: root.length });

    const rootHex = Buffer.from(root).toString('hex');
    const prevRootHex = Buffer.from(prevRootHash).toString('hex');

    return {
      fullTree: {
        rootHash: { raw: root, hex: rootHex },
        prevRootHash: { raw: prevRootHash, hex: prevRootHex },
        leafs: [{ prevRootHash }, leafs],
      },
      rewardsClaimTree: {
        rootHash: { raw: root, hex: rootHex },
        leafs: claimLeafs,
        proofs: Object.fromEntries(claimLeafs.map((v) => [v.user, getMerkleProof(encodedLeaves, leafToEncoded(v))])),
      },
    };
  }
}
