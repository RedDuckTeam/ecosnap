import type { GgcResponse } from './gcs';

import { httpClient } from '../client';

const GET_EVENTS = 'api/gc';

export const getUserGcs = async (pubkey: string) => {
  return await httpClient.get<GgcResponse>(`${GET_EVENTS}/${pubkey}?pubkey=${pubkey}`);
};
