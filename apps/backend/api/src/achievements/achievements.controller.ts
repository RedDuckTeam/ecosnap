import { Achievement, MerkleProof, MerkleTreeType, SubmissionType, UserAchievement } from '@gc/database-gc';
import { Controller, Get, Param, Query } from '@nestjs/common';
import { PublicKey } from '@solana/web3.js';
import { DataSource } from 'typeorm';

@Controller('achievements')
export class AchievementsController {
  constructor(private readonly dataSource: DataSource) {}

  @Get('/')
  async getAchievements() {
    const achievements = await this.dataSource.getRepository(Achievement).find({});

    return achievements.map((v) => ({
      ...v,
    }));
  }

  @Get('/user/:pubkey')
  async getUserAchievements(@Param('pubkey') pubkey: string) {
    console.log('KEY', pubkey);
    const achievements = await this.dataSource.getRepository(UserAchievement).find({
      where: {
        user: {
          pubKey: new PublicKey(pubkey),
        },
        received: true,
      },
      relations: {
        achievement: true,
        merkleSubmissions: true,
      },
    });

    const proofs: (MerkleProof | null)[] = [];

    for (let ach of achievements) {
      const proofsRepo = this.dataSource.getRepository(MerkleProof);
      const id = ach.merkleSubmissions?.find?.((v) => v.treeType === MerkleTreeType.ONLY_PROOFS)?.id;

      if (!id) {
        proofs.push(null);
        continue;
      }

      const proofsEntity = await proofsRepo.findOne({
        where: {
          submission: {
            id,
          },
          user: ach.user,
        },
      });

      proofs.push(proofsEntity);
    }

    return {
      achievements: achievements.map((ach, i) => ({
        ...ach,
        merkleTreeId: ach.merkleSubmissions?.find?.((v) => v.treeType === MerkleTreeType.ONLY_PROOFS)?.id,
        proofs: proofs[i],
      })),
    };
  }
}
