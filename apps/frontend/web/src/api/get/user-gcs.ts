

import { httpClient } from '../client';
import { GgcResponse } from './gcs';

const GET_EVENTS = '/gc';

export const getUserGcs = async (pubkey: string) => {
  const events =  (await httpClient.get<GgcResponse>(`${GET_EVENTS}/${pubkey}`));
  
  return events;
};
