import { CanActivate, ExecutionContext, Inject, Injectable, UnauthorizedException, UseGuards } from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';
import { Request } from 'express';
import { DataSource, EntityManager } from 'typeorm';
import { JwtService } from '../jwt/jwt.service';
import { UserClaims } from '../decorators/request-user.decorator';
import { PublicKey } from '@solana/web3.js';
import { User } from '@gc/database-gc';
import { Observable } from 'rxjs';

export const UseBaseAuthGuard = (): MethodDecorator => {
  return <T>(
    // eslint-disable-next-line @typescript-eslint/ban-types
    target: Object,
    propertyKey: string | symbol,
    descriptor: TypedPropertyDescriptor<T>
  ) => {
    UseGuards(BaseAuthGuard)(target, propertyKey, descriptor);
    ApiBearerAuth()(target, propertyKey, descriptor);
  };
};

export abstract class BaseAuthGuard implements CanActivate {
  constructor(
    protected readonly jwtService: JwtService,
    protected readonly dataSource: DataSource
  ) {}
  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    throw new Error('Method not implemented.');
  }

  protected async _canActivate<TClaims extends object = UserClaims, TJwtPayload extends object = { pubKey: string }>(
    context: ExecutionContext,
    getRequestUser: (payload: TJwtPayload) => TClaims,
    getToken: (r: Request) => string | undefined = this._extractTokenFromHeader,
    verifyToken: (token: string) => Promise<TJwtPayload> = this._verifyTokenJwtService
  ): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = getToken.call(this, request);

    if (!token) {
      throw new UnauthorizedException();
    }

    try {
      const payload = await verifyToken.call(this, token);
      request['user'] = getRequestUser(payload);
    } catch (err) {
      throw new UnauthorizedException();
    }
    return true;
  }

  protected async verifyDbUser<TUserClaims extends { pubKey: PublicKey }>(
    context: ExecutionContext,
    verifier: (manager: EntityManager, dbUser: User | null, claims: TUserClaims) => Promise<boolean>
  ): Promise<boolean> {
    const request = context.switchToHttp().getRequest();

    const userClaims = this.getUserFromRequest<TUserClaims>(request);

    if (!userClaims) throw new UnauthorizedException();

    return await this.dataSource.transaction(async (manager) => {
      const userRepo = manager.getRepository(User);

      const user = await userRepo.findOneBy({
        pubKey: userClaims.pubKey,
      });

      return await verifier(manager, user ?? null, userClaims);
    });
  }

  protected getUserFromRequest<T>(request: Request & { user: UserClaims }): T | undefined {
    return request['user'] as T;
  }

  protected async _verifyTokenJwtService<TClaims extends object = UserClaims>(token: string) {
    return await this.jwtService.verifyAsync<TClaims>(token);
  }

  protected _extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
