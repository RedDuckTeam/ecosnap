import { httpClient } from '../client';

const POST = 'api/cleanup-event/admin/participate/accept';

export const postParticipationAccept = async ({
  jwt,
  eventId,
  participationId,
  signature,
}: {
  jwt: string;
  participationId: string;
  signature: string;
  eventId: string;
}) => {
  const res = await httpClient.post<void>(
    `${POST}/`,
    {
      eventId,
      participationId,
      signature,
    },
    {
      Authorization: 'Bearer ' + jwt,
    }
  );

  return res;
};
