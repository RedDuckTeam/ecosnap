import { httpClient } from '../client';

export type Participants = {
  participants: {
    participationId: string;
    participant: string;
    status: number | null;
    resultStatus: number | null;
  }[];
};

const GET_PARTICIPANTS = 'api/participatants';

export const getEventParticipants = async ({ eventId }: { eventId: string }) => {
  const events = await httpClient.get<Participants>(`${GET_PARTICIPANTS}?eventId=${encodeURIComponent(eventId)}`);
  return events;
};
