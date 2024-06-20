import { httpClient } from '../client';

const POST = 'api/achievements/user';

export type GetUserAchievementsResponse = {
  achievements: {
    proofs: {
      proof: Buffer[];
      leaf: {
        user: string;
        amount: number;
      };
    };
    id: string;
    isMinted: boolean;
    merkleTreeId: string;
    received: boolean;
    currentPoints: number;
    merkleSubmitted: boolean;
    achievement: {
      description: string;
      id: string;
      canHaveMany: boolean;
      imageUrl: string;
    };
  }[];
};

export const getUserAchievements = async ({ user }: { user: string }) => {
  const res = await httpClient.get<GetUserAchievementsResponse>(`${POST}/${encodeURIComponent(user)}`);

  console.log('res', res);
  // if (res.status !== 200) throw new Error('Request failed');

  return {
    ...res.data,
  };
};
