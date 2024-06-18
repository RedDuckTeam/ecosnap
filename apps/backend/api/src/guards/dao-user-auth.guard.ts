import { CanActivate, ExecutionContext, Inject, Injectable, UnauthorizedException, UseGuards } from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';
import { Request } from 'express';
import { DataSource, EntityManager } from 'typeorm';

import { BaseAuthGuard } from './base-auth.guard';
import { UserClaims } from '../decorators/request-user.decorator';
import { JwtService } from '../jwt/jwt.service';
import { PublicKey } from '@solana/web3.js';

export const UseDaoUserAuthGuard = (): MethodDecorator => {
  return <T>(
    // eslint-disable-next-line @typescript-eslint/ban-types
    target: Object,
    propertyKey: string | symbol,
    descriptor: TypedPropertyDescriptor<T>
  ) => {
    UseGuards(DaoUserAuthGuard)(target, propertyKey, descriptor);
    ApiBearerAuth()(target, propertyKey, descriptor);
  };
};

@Injectable()
export class DaoUserAuthGuard extends BaseAuthGuard {
  constructor(jwtService: JwtService, dataSource: DataSource) {
    super(jwtService, dataSource);
  }

  override async canActivate(context: ExecutionContext): Promise<boolean> {
    const canActivateBase = await this._canActivate<UserClaims>(context, (payload) => {
      return {
        pubKey: new PublicKey(payload.pubKey),
      };
    });

    if (!canActivateBase) throw new UnauthorizedException();

    return await this.verifyDbUser(context, async (manager, dbUser, UserClaims) => {
      if (!dbUser) throw new UnauthorizedException('User is not found');

      if (!dbUser.canVote) throw new UnauthorizedException('User is not in dao');
      return true;
    });
  }
}
