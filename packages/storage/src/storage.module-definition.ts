import { ConfigurableModuleBuilder } from '@nestjs/common';

export class StorageModuleConfig {
  // TODO
  email: string;
  password: string;
}

export const { ConfigurableModuleClass, ASYNC_OPTIONS_TYPE } = new ConfigurableModuleBuilder<StorageModuleConfig>()
  .setClassMethodName('forRoot')
  .setExtras({ global: true }, (definition, extras) => ({
    ...definition,
    global: extras.global,
  }))
  .build();
