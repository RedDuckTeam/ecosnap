import { Injectable, NotFoundException } from '@nestjs/common';
import { PublicKey } from '@solana/web3.js';
import { DataSource } from 'typeorm';
import 'multer';
import { User } from '@gc/database-gc';

@Injectable()
export class PointsService {
  constructor(private readonly dataSource: DataSource) {}

  async getUserPoints(pubKey: PublicKey): Promise<number> {
    const userRepository = this.dataSource.getRepository(User);

    const userData = await userRepository.findOne({ where: { pubKey } });

    if (!userData) throw new NotFoundException('No such user!');

    return userData.points;
  }
}
