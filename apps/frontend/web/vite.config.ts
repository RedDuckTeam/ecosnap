import react from '@vitejs/plugin-react';
import { defineConfig, loadEnv } from 'vite';

import path from 'node:path';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');

  return {
    build: {
      sourcemap: env.NODE_ENV === 'production',
    },
    plugins: [react()],
    define: {
      global: 'window',
      process: { env: 'import.meta.env', browser: true },
    },

    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
        stream: 'stream-browserify',
        '@ledgerhq/errors': '@ledgerhq/errors/lib/index.js',
      },
    },
  };
});
