import { DynamicModule, Module } from '@nestjs/common';
import { JwtModule as NestJwtModule } from '@nestjs/jwt';

import { assert } from 'console';

import { ASYNC_OPTIONS_TYPE, ConfigurableModuleClass, OPTIONS_TYPE } from './jwt.module-declaration';
import { JwtService } from './jwt.service';
import { JWT_AUTH_SECRET_INJECT_KEY, JWT_EXPIRES_IN_S_INJECT_KEY } from './jwt.service';

@Module({})
export class JwtModule extends ConfigurableModuleClass {
  static forRootAsync(asyncOptions: typeof ASYNC_OPTIONS_TYPE): DynamicModule {
    assert(asyncOptions.useFactory, 'useFactory is undefined');

    return {
      ...super.forRootAsync(asyncOptions),
      global: asyncOptions.global,
      exports: [JwtService],
      imports: [...(asyncOptions.imports ?? []), NestJwtModule],
      providers: [
        {
          provide: JWT_AUTH_SECRET_INJECT_KEY,
          inject: asyncOptions.inject,
          useFactory: async (...args: any[]) => {
            const options = await asyncOptions.useFactory?.(...args);

            if (!options) throw new Error('options is undefined');

            return options.jwtAuthSecret;
          },
        },
        {
          provide: JWT_EXPIRES_IN_S_INJECT_KEY,
          inject: asyncOptions.inject,
          useFactory: async (...args: any[]) => {
            const options = await asyncOptions.useFactory?.(...args);

            if (!options) throw new Error('options is undefined');

            return options.jwtExpiresInS;
          },
        },
        JwtService,
      ],
    };
  }
}
