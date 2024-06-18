import { ConfigurableModuleBuilder } from '@nestjs/common';

export class JwtModuleOptions {
  jwtAuthSecret: string;
  jwtExpiresInS: number;
}

export const { ConfigurableModuleClass, MODULE_OPTIONS_TOKEN, ASYNC_OPTIONS_TYPE, OPTIONS_TYPE } =
  new ConfigurableModuleBuilder<JwtModuleOptions>()
    .setExtras(
      {
        global: true,
      },
      (definition, extras) => ({
        ...definition,
        global: extras.global,
      })
    )
    .setClassMethodName('forRoot')
    .build();
