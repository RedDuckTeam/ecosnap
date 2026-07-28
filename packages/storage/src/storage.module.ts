import { DynamicModule, Module } from '@nestjs/common';
import { ASYNC_OPTIONS_TYPE, ConfigurableModuleClass, StorageModuleConfig } from './storage.module-definition';

import { ConfigService } from '@nestjs/config';
import { StorageService } from './storage.service';

export const storageModuleDefaultFactory = (configService: ConfigService): StorageModuleConfig => {
  const email = configService.getOrThrow<string>('AKORD_EMAIL');
  const password = configService.getOrThrow<string>('AKORD_PASSWORD');

  return {
    email,
    password,
  };
};

@Module({})
export class StorageModule extends ConfigurableModuleClass {
  public static forRootAsync(options: typeof ASYNC_OPTIONS_TYPE): DynamicModule {
    return {
      ...super.forRootAsync(options),
      module: StorageModule,
      exports: [StorageService],
      imports: options.imports,
      providers: [
        {
          provide: 'STORAGE_CONFIG',
          inject: options.inject ?? [ConfigService],
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          useFactory: async (...params: any[]) => {
            options.useFactory ??= storageModuleDefaultFactory;

            const config = await options.useFactory?.(...params);
            if (!config) {
              throw new Error('ProviderOptions is required');
            }
            return config;
          },
        },
        StorageService,
      ],
    };
  }
}
