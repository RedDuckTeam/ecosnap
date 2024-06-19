import { BadRequestException, Injectable } from '@nestjs/common';
import { PublicKey } from '@solana/web3.js';
import { DataSource } from 'typeorm';
import { AuthNonce, User } from '@gc/database-gc';
import * as nacl from 'tweetnacl';
import bs58 from 'bs58';
import { JwtService } from '../jwt/jwt.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly dataSource: DataSource,
    private readonly jwtService: JwtService
  ) {}

  async createAccessToken({ signature, nonce, pubKey }: { signature: string; nonce: string; pubKey: PublicKey }) {
    const expectedSignedMessage = this.getSignMessage(nonce);

    const verified = nacl.sign.detached.verify(
      new TextEncoder().encode(expectedSignedMessage),
      bs58.decode(signature),
      pubKey.toBuffer()
    );

    if (!verified) throw new BadRequestException('Invalid signature');

    await this.dataSource.manager.transaction(async (manager) => {
      const noncesRepo = manager.getRepository(AuthNonce);
      const userRepo = manager.getRepository(User);

      let user = await userRepo.findOneBy({
        pubKey,
      });

      if (!user) {
        user = await userRepo.save(
          userRepo.create({
            pubKey,
          })
        );
      }

      let unusedNonce = await noncesRepo.findOneBy({
        id: nonce,
      });

      if (unusedNonce && unusedNonce.used) throw new BadRequestException('Provided nonce is already been used');

      unusedNonce ??= await noncesRepo.save(
        noncesRepo.create({
          id: nonce,
          user,
          used: true,
        })
      );

      unusedNonce.used = true;

      await noncesRepo.save(unusedNonce);
    });

    return await this.jwtService.signAsync({
      pubKey: pubKey.toBase58(),
    });
  }

  async getAuthNonce(userPubKey: PublicKey) {
    return await this.dataSource.manager.transaction(async (manager) => {
      const noncesRepo = manager.getRepository(AuthNonce);
      const usersRepo = manager.getRepository(User);

      const unusedNonce = await noncesRepo.findOneBy({
        used: false,
        user: { pubKey: userPubKey },
      });

      if (unusedNonce) return unusedNonce.id;

      const user = await usersRepo.findOneBy({
        pubKey: userPubKey,
      });

      if (!user) throw new BadRequestException('User is not found');

      const newNonce = await noncesRepo.save(
        noncesRepo.create({
          user,
          used: false,
        })
      );

      return newNonce.id;
    });
  }

  getSignMessage(nonce: string) {
    return `Authorize in GarbageCollector: ${nonce}`;
  }
}
