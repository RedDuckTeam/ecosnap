import type { GgcResponse } from './gcs';

import { httpClient } from '../client';

const GET_EVENTS = 'api/gc';

export const getUserGcs = async (pubkey: string) => {
  const events = await httpClient.get<GgcResponse>(`${GET_EVENTS}/${pubkey}`);

  return events;
};
