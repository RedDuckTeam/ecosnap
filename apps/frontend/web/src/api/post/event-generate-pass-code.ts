import { httpClient } from '../client';
const POST = 'api/cleanup-event/admin/pass-code';

type PassCodeResponse = {
  code: string;
};

export const postGeneratePassCode = async ({ jwt, eventId }: { jwt: string; eventId: string }) => {
  const res = await httpClient.post<PassCodeResponse>(
    `${POST}/`,
    {
      eventId,
    },
    {
      Authorization: 'Bearer ' + jwt,
    },
  );

  return res;
};
