import { Body, Controller, Get, Post, Query } from '@nestjs/common';

import { ApiProperty, ApiTags } from '@nestjs/swagger';
import { UseUserAuthGuard } from '../guards/user-auth.guard';
import 'multer';
import { RequestUser, UserClaims } from '../decorators/request-user.decorator';
import { IsString } from 'class-validator';
import { PublicKey } from '@solana/web3.js';
import { CouponsService } from './coupons.service';

export const CLEANUP_EVENT_API_TAG = 'Coupons';

export class BuyDTO {
  @ApiProperty({ type: String })
  @IsString()
  signature: string;

  @ApiProperty({ type: String })
  @IsString()
  couponId: string;
}

@Controller('coupons')
@ApiTags(CLEANUP_EVENT_API_TAG)
export class CouponsController {
  constructor(private readonly couponsService: CouponsService) {}

  @Get('/')
  async getAllCoupons() {
    return { coupons: await this.couponsService.getAllCoupons() };
  }
  @Get('/user')
  async getUserCoupons(@Query('pubKey') pubKey: string) {
    return { coupons: await this.couponsService.getUserCoupons(new PublicKey(pubKey)) };
  }
  @Post('/buy')
  @UseUserAuthGuard()
  async postParticipate(@Body() { couponId, signature }: BuyDTO, @RequestUser() user: UserClaims) {
    const boughtCoupon = await this.couponsService.buy({ signature, couponId, userPubkey: user.pubKey });
    return {
      userCouponId: boughtCoupon,
    };
  }
}
