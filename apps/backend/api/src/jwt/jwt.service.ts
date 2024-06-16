import { Inject, Injectable } from '@nestjs/common';
import { JwtService as NestJwtService } from '@nestjs/jwt';

export const JWT_AUTH_SECRET_INJECT_KEY = 'JWT_AUTH_SECRET' as const;
export const JWT_EXPIRES_IN_S_INJECT_KEY = 'JWT_EXPIRES_IN_S' as const;

@Injectable()
export class JwtService {
  constructor(
    @Inject(JWT_AUTH_SECRET_INJECT_KEY)
    private readonly jwtAuthSecret: string,
    @Inject(JWT_EXPIRES_IN_S_INJECT_KEY)
    private readonly jwtExpiresInS: number,
    private readonly jwtService: NestJwtService
  ) {}

  async verifyAsync<T extends object = any>(token: string) {
    return this.jwtService.verifyAsync<T>(token, {
      secret: this.jwtAuthSecret,
    });
  }

  async signAsync<T extends object | Buffer>(payload: T) {
    return this.jwtService.signAsync(payload, {
      secret: this.jwtAuthSecret,
      expiresIn: this.jwtExpiresInS,
    });
  }
}
