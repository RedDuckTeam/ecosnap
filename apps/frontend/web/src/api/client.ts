import { env } from '@/env.ts';
import { Fetcher } from '@/lib/fetcher';

export const httpClient = new Fetcher(new URL(env.VITE_BACKEND_URL ?? ''), {
  'Content-Type': 'application/json',
});

export const formDataHttpClient = new Fetcher(new URL(env.VITE_BACKEND_URL ?? ''), {});
