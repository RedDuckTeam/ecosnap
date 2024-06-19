import { httpClient } from '../client';

const POST = 'api/user';

type GetUserResponse = {
  user: {
    registrationDate: Date;
    points: number;
    pubKey: string;
    canVote: boolean;
    garbageCollects: number;
  };
};

export const getUser = async ({ jwt }: { jwt: string }) => {
  const res = await httpClient.get<GetUserResponse>(`${POST}`, {
    Authorization: 'Bearer ' + jwt,
  });

  if (res.status !== 200) throw new Error('Request failed');

  return {
    ...res,
    registrationDate: new Date(res.data!.user.registrationDate),
  };
};
