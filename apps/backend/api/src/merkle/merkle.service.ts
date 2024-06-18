import { MerkleProof } from '@gc/database-gc';
import { Injectable } from '@nestjs/common';
import { PublicKey } from '@solana/web3.js';
import { DataSource } from 'typeorm';

@Injectable()
export class MerkleService {
  constructor(private readonly dataSource: DataSource) {}

  async getProofs({ submissionId, user }: { user: PublicKey; submissionId: string }) {
    const proofs = await this.dataSource.getRepository(MerkleProof).find({
      where: {
        submission: {
          id: submissionId,
        },
        user: {
          pubKey: user,
        },
      },
    });

    return proofs.map((v) => ({
      proof: v.proof,
      leaf: v.leaf,
    }));
  }
}
