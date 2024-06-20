import { createEnv } from '@t3-oss/env-core';
import { z } from 'zod';

export const env = createEnv({
  clientPrefix: 'VITE_',
  client: {
    VITE_SOLANA_RPC_ENDPOINT: z.string().min(1),
    VITE_BACKEND_URL: z.string().min(1),
  },
  runtimeEnv: import.meta.env,
  emptyStringAsUndefined: true,
});
