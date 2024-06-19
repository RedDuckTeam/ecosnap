import { httpClient } from '../client';
import type { CastVoteDirection } from '../post/vote';

export type GgcResponse = {
  gcs: IGcsBody[];
};

export interface IGcsBody {
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
  user: string;
  votes: {
    direction: CastVoteDirection;
    user: string;
  }[];
}

const GET_EVENTS = 'api/gc';

export const getGcs = async () => {
  return await httpClient.get<GgcResponse>(`${GET_EVENTS}`);
};
