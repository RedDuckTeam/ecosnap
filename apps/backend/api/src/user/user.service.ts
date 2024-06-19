import { Injectable, NotFoundException } from '@nestjs/common';
import { PublicKey } from '@solana/web3.js';
import { DataSource } from 'typeorm';
import 'multer';
import { User } from '@gc/database-gc';

@Injectable()
export class UserService {
  constructor(private readonly dataSource: DataSource) {}

  async getUser(pubKey: PublicKey) {
    const userRepository = this.dataSource.getRepository(User);

    const userData = await userRepository.findOne({
      where: { pubKey },
      relations: {
        garbageCollects: true,
      },
    });

    if (!userData) throw new NotFoundException('No such user!');

    return {
      registrationDate: userData.createdAt,
      points: userData.points,
      pubKey: userData.pubKey.toBase58(),
      canVote: userData.canVote,
      garbageCollects: userData.garbageCollects.length,
    };
  }
}
