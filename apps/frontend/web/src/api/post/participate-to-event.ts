

import { httpClient } from '../client';

const POST = '/cleanup-event/participate';

export const postParticipate = async ({
    jwt,
    signature,
    eventEntryCode
 }: { 
    jwt: string,
    signature: string;
    eventEntryCode: string;
}) => {
  const res = (await httpClient.post<void>(`${POST}/`, {
    signature,
    eventEntryCode
  },
  {
    Authorization: 'Bearer ' + jwt
  }));

  return res;
};
