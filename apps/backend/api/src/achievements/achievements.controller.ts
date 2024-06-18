import { Achievement, UserAchievement } from '@gc/database-gc';
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

    return achievements.map((v) => ({
      ...v,
    }));
  }
}
