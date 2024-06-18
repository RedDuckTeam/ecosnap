/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { DynamicModule, Logger, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { DatabaseModule } from '@gc/database-common';
import { defaultDataSource } from '../../../../packages/database/gc/dist';

import path from 'path';
import { JwtModule } from './jwt/jwt.module';
import { AuthModule } from './auth/auth.module';
import { DaoModule } from './dao/dao.module';
import { GcModule } from './gc/gc.module';
import { StorageModule } from '@gc/storage';
import { CleanupEventModule } from './cleanup-event/cleanup-event.module';
import { AchievementsModule } from './achievements/achievements.module';
import { MerkleController } from './merkle/merkle.controller';

class GlobalProviders {
  static forRoot(): DynamicModule {
    return {
      global: true,
      module: GlobalProviders,
      providers: [
        Logger,
        {
          provide: 'POINTS_PER_SUCCESS_FULL_GC',
          inject: [ConfigService],
          useFactory: (config: ConfigService) => {
            return +config.get('POINTS_PER_SUCCESS_FULL_GC', '10');
          },
        },
      ],
      exports: [Logger, 'POINTS_PER_SUCCESS_FULL_GC'],
    };
  }
}

@Module({
  imports: [
    GlobalProviders.forRoot(),
    ConfigModule.forRoot({ isGlobal: true, envFilePath: ['.env.development', '.env', path.resolve('../../../.env')] }),
    DatabaseModule.forRootAsync({
      global: true,
      useFactory: async () => {
        return {
          options: (_) => defaultDataSource,
        };
      },
    }),
    JwtModule.forRootAsync({
      global: true,
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (config: ConfigService) => {
        const jwtAuthSecret = config.get('JWT_AUTH_SECRET', 'TEST-SECRET');
        const jwtExpiresInS = config.get('JWT_EXPIRES_IN_S', 2 * 3600);

        return {
          jwtAuthSecret: jwtAuthSecret,
          jwtExpiresInS: jwtExpiresInS,
        };
      },
    }),
    StorageModule.forRootAsync({
      global: true,
    }),
    AuthModule,
    DaoModule,
    GcModule,
    CleanupEventModule,
    AchievementsModule,
    MerkleController,
  ],
  providers: [],
  exports: [],
})
export class AppModule {}
