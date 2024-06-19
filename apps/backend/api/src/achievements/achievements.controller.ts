import { Achievement, MerkleProof, MerkleTreeType, SubmissionType, UserAchievement } from '@gc/database-gc';
import { Controller, Get, Query } from '@nestjs/common';
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
  async getUserAchievements(@Query('pubkey') pubkey: string) {
    const achievements = await this.dataSource.getRepository(UserAchievement).find({
      where: {
        user: {
          pubKey: new PublicKey(pubkey),
        },
      },
      relations: {
        achievement: true,
      },
    });

    const proofs: (MerkleProof | null)[] = [];

    for (let ach of achievements) {
      const proofsRepo = this.dataSource.getRepository(MerkleProof);
      const id = ach.merkleSubmissions?.find((v) => v.treeType === MerkleTreeType.ONLY_PROOFS)?.id;

      if (!id) throw new Error('Id is undefined');

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
      achievements: achievements.map((v, i) => ({
        ...v,
        proofs: proofs[i],
      })),
    };
  }
}
