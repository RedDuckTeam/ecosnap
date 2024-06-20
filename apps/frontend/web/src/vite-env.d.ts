/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_SOLANA_RPC_ENDPOINT: string;
  readonly VITE_BACKEND_URL: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
