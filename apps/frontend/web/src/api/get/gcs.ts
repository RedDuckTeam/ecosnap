import { httpClient } from '../client';

export type GgcResponse = {
  gcs: {
    daoVotes: {
      for: number;
      against: number;
      threshold: number;
    };
    merkleSubmitted: boolean;
    pointsGiven: number;
    description: string;
    id: string;
    files: { uri: string; id: string; fileExtension: string }[];
  }[];
};

const GET_EVENTS = 'api/gc';

export const getGcs = async () => {
  const events = await httpClient.get<GgcResponse>(`${GET_EVENTS}`);

  return events;
};
