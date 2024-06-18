import { httpClient } from '../client';

const POST = '/auth/access-token';

type GetAuthTokenResponse = {
  accessToken: string;
};

export const getAuthToken = async ({
  signature,
  nonce,
  pubkey,
}: {
  signature: string;
  nonce: string;
  pubkey: string;
}) => {
  const res = await httpClient.get<GetAuthTokenResponse>(
    `${POST}?signature=${encodeURIComponent(signature)}&nonce=${encodeURIComponent(nonce)}&pubkey=${encodeURIComponent(pubkey)}`,
  );

  return res;
};
