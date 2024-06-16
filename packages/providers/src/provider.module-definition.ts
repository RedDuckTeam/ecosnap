import { ConfigurableModuleBuilder } from '@nestjs/common';

export class ProvidersModuleConfig {
  sol: {
    rpc: string;
    pk?: string;
  };
}

export const { ConfigurableModuleClass, ASYNC_OPTIONS_TYPE } = new ConfigurableModuleBuilder<ProvidersModuleConfig>()
  .setClassMethodName('forRoot')
  .setExtras({ global: true }, (definition, extras) => ({
    ...definition,
    global: extras.global,
  }))
  .build();
