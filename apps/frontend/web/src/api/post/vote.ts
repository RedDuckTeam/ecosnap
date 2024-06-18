

import { httpClient } from '../client';

const POST_VOTE = '/dao/vote';

export enum CastVoteDirection {
  FOR,
  AGAINST,
}

export const postVote = async ({
    garbageCollectId,
    signature,
    voteDirection,
    jwt
 }: { 
    jwt: string,
    garbageCollectId: string,
    signature: string,
    voteDirection: CastVoteDirection
}) => {
  (await httpClient.post<void>(`${POST_VOTE}/`, {
    garbageCollectId,
    signature,
    voteDirection
  }, { 
    Authorization: 'Bearer ' + jwt
  }));
};
