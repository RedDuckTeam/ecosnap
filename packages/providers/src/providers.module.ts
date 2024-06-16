import { DynamicModule, Injectable, Module } from '@nestjs/common';
import { ASYNC_OPTIONS_TYPE, ConfigurableModuleClass, ProvidersModuleConfig } from './provider.module-definition';

import { ConfigService } from '@nestjs/config';
import { ProvidersService } from './providers.service';
import { PublicKey } from '@solana/web3.js';

export const providersModuleDefaultFactory = (configService: ConfigService) => {
  const solRpc = configService.get<string>('SOL_RPC', '');
  const solPk = configService.get<string>('SOL_PK');
  const solMerkleSubmitter = configService.get<string>(
    'SOL_MERKLE_SUBMITTER_PROGRAM_ID',
    '5Mew5NxqLr5NGG6VbHtkNNK6LNGa5ucKyuV6stWmfy16'
  );

  return {
    sol: {
      rpc: solRpc,
      pk: solPk,
      programs: {
        merkleSubmitter: new PublicKey(solMerkleSubmitter),
      },
    },
  } as ProvidersModuleConfig;
};

@Module({})
export class ProvidersModule extends ConfigurableModuleClass {
  public static forRootAsync(options: typeof ASYNC_OPTIONS_TYPE): DynamicModule {
    return {
      ...super.forRootAsync(options),
      module: ProvidersModule,
      exports: [ProvidersService],
      imports: options.imports,
      providers: [
        {
          provide: 'PROVIDERS_CONFIG',
          inject: options.inject ?? [ConfigService],
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          useFactory: async (...params: any[]) => {
            options.useFactory ??= providersModuleDefaultFactory;

            const config = await options.useFactory?.(...params);
            if (!config) {
              throw new Error('ProviderOptions is required');
            }
            return config;
          },
        },
        ProvidersService,
      ],
    };
  }
}
