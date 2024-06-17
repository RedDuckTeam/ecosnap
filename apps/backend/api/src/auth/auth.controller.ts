import { BadRequestException, Controller, Get, Injectable, Query } from '@nestjs/common';
import { PublicKey } from '@solana/web3.js';
import { DataSource, EntityManager } from 'typeorm';
import { AuthNonce, User } from '@gc/database-gc';
import { JwtService } from '../jwt/jwt.service';
import { ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';

export const AUTH_API_TAG = 'Auth';

@Controller('auth')
@ApiTags(AUTH_API_TAG)
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('/access-token')
  async getAccessToken(
    @Query('signature') signature: string,
    @Query('nonce') nonce: string,
    @Query('pubKey') pubKey: string
  ) {
    return {
      accessToken: await this.authService.createAccessToken({ signature, nonce, pubKey: new PublicKey(pubKey) }),
    };
  }

  @Get('/message')
  async getSignMessage(@Query('pubKey') pubKey: string) {
    const authNonce = await this.authService.getAuthNonce(new PublicKey(pubKey));
    return { message: this.authService.getSignMessage(authNonce), nonce: authNonce };
  }
}
