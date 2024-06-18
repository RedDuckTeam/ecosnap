import { httpClient } from '../client';

type Events = {
  events: {
    id: string;
    city: string;
    name: string;
    pictureUrl?: string;
    rewards: number;
    eventStartsAt: number;
    eventEndsAt: number;
    participants: number;
    maximumParticipants: number;
    description: string;
    admins: string[];
    files: { uri: string; fileExtension: string }[];
  }[];
};

const GET_EVENTS = '/cleanup-event';

export const getEvents = async () => {
  const events = await httpClient.get<Events>(`${GET_EVENTS}`);

  return events;
};
