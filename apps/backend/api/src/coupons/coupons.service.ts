import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PublicKey } from '@solana/web3.js';
import { DataSource } from 'typeorm';
import {
  CleanupEvent,
  CleanupEventParticipation,
  CleanupEventPassCode,
  ParticipationResultsStatus,
  ParticipationStatus,
  User,
  File,
  Coupon,
  UserCoupon,
} from '@gc/database-gc';
import * as nacl from 'tweetnacl';
import bs58 from 'bs58';
import crypto from 'crypto';
import { getFileExtensionFromFile } from '../lib/utils/utils';
import { StorageService } from '@gc/storage';
import { AchievementsService } from '../achievements/achievements.service';
import { DaoService } from '../dao/dao.service';
import { IsUUID } from 'class-validator';
import e from 'express';

@Injectable()
export class CouponsService {
  constructor(
    private readonly dataSource: DataSource,
    private readonly achievementsService: AchievementsService,
    private readonly storageService: StorageService,
    private readonly daoService: DaoService
  ) {}

  async getAllCoupons() {
    return await this.dataSource.manager.transaction(async (manager) => {
      const couponsRepo = manager.getRepository(Coupon);
      const coupons = await couponsRepo.find({});
      return coupons.map((v) => ({
        ...v,
      }));
    });
  }

  async getUserCoupons(user: PublicKey) {
    return await this.dataSource.manager.transaction(async (manager) => {
      const couponsRepo = manager.getRepository(UserCoupon);
      const coupons = await couponsRepo.find({
        where: {
          user: {
            pubKey: user,
          },
        },
        relations: ['coupon'],
      });

      return coupons.map((v) => ({
        id: v.id,
        coupon: v.coupon,
        isRedeemed: v.isRedeemed,
        createdAt: v.createdAt,
      }));
    });
  }

  async buy({ signature, couponId, userPubkey }: { userPubkey: PublicKey; signature: string; couponId: string }) {
    return await this.dataSource.manager.transaction(async (manager) => {
      const couponRepo = manager.getRepository(Coupon);
      const userCouponRepo = manager.getRepository(UserCoupon);
      const userRepo = manager.getRepository(User);

      const coupon = await couponRepo.findOne({
        where: {
          id: couponId,
        },
      });

      if (!coupon) throw new BadRequestException('Coupon code is not found');

      const user = await userRepo.findOneBy({
        pubKey: userPubkey,
      });

      if (!user) throw new BadRequestException('User is not found');
      if (user.points < coupon.pointsPrice) throw new BadRequestException('Not enough balance');

      const signedMessage = this.getBuyMessage(couponId);

      const verified = nacl.sign.detached.verify(
        new TextEncoder().encode(signedMessage),
        bs58.decode(signature),
        userPubkey.toBuffer()
      );

      if (!verified) throw new BadRequestException('Invalid signature');

      const createdCoupon = await userCouponRepo.save(
        userCouponRepo.create({
          user,
          coupon,
          buySignature: signature,
        })
      );

      user.points -= coupon.pointsPrice;

      await manager.save(user);

      return createdCoupon.id;
    });
  }

  getBuyMessage(id: string) {
    return `Confirming coupon buy for: ${id}`;
  }
}
