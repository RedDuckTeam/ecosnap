import { DynamicModule, Logger, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from '@gc/database-common';

import path from 'path';
import { StorageModule } from '@gc/storage';
import { defaultDataSource } from '@gc/database-gc';
import { SubmitterModule } from './submitter/submitter.module';

class GlobalProviders {
  static forRoot(): DynamicModule {
    return {
      global: true,
      module: GlobalProviders,
      providers: [Logger],
      exports: [Logger],
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

    StorageModule.forRootAsync({
      global: true,
    }),
    SubmitterModule,
  ],
  providers: [],
  exports: [],
})
export class AppModule {}
