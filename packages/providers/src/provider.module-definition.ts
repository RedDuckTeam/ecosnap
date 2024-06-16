import { ConfigurableModuleBuilder } from '@nestjs/common';
import { PublicKey } from '@solana/web3.js';

export class ProvidersModuleConfig {
  sol: {
    rpc: string;
    pk?: string;
    programs: {
      merkleSubmitter: PublicKey;
    };
  };
}

export const { ConfigurableModuleClass, ASYNC_OPTIONS_TYPE } = new ConfigurableModuleBuilder<ProvidersModuleConfig>()
  .setClassMethodName('forRoot')
  .setExtras({ global: true }, (definition, extras) => ({
    ...definition,
    global: extras.global,
  }))
  .build();
