import type { Events } from './events';

import { httpClient } from '../client';

const GET_EVENTS = 'api/cleanup-event/user';

export const getUserEvents = async (pubkey: string) => {
  return await httpClient.get<Events>(`${GET_EVENTS}/?pubkey=${pubkey}`);
};
