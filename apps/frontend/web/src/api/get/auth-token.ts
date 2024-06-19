import { httpClient } from '../client';

const POST = 'api/auth/access-token/';

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
  const url = `${POST}?signature=${encodeURIComponent(signature)}&nonce=${encodeURIComponent(nonce)}&pubKey=${encodeURIComponent(pubkey)}`;
  console.log('url', { url });

  const res = await httpClient.get<GetAuthTokenResponse>(url);
  console.log('res', { res });

  return res;
};
