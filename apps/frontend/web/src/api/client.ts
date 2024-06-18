import { Fetcher } from '@/lib/fetcher';

export const httpClient = new Fetcher(new URL('http://localhost:3001/api'), {});
