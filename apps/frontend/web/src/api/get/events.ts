import { httpClient } from '../client';

export type Events = {
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

const GET_EVENTS = 'cleanup-event';

export const getEvents = async () => {
  const events = await httpClient.get<Events>(`${GET_EVENTS}`);

  // const temp = {
  //   events: [
  //     {
  //       id: '1',
  //       city: '1',
  //       name: 'Clean park',
  //       pictureUrl: 'https://cdn.pixabay.com/photo/2014/02/27/16/10/flowers-276014_640.jpg',
  //       rewards: 40,
  //       eventStartsAt: 4545465,
  //       eventEndsAt: 546545645,
  //       participants: 40,
  //       maximumParticipants: 50,
  //       description: 'SDiasjdoiasjoid asjdoa sjia jdioasjdij asd',
  //       admins: ['0x6E2F1d7eE2Aa23007448810bd21BbCccE07fF21c'],
  //       files: { uri: 'asdasd', fileExtension: 'png' },
  //     },
  //   ],
  // };

  return events;
};
