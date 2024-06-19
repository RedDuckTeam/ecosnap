import { useWallet } from '@solana/wallet-adapter-react';
import { useMutation } from '@tanstack/react-query';

import { useSignAuth } from './signatures/use-sign-auth';

import { getAuthToken } from '@/api/get/auth-token';

export const useAuth = () => {
  const { publicKey } = useWallet();
  const { mutateAsync } = useSignAuth();

  return useMutation({
    mutationFn: async () => {
      if (!publicKey) {
        throw new Error('No public key');
      }

      let accessToken = localStorage.getItem('accessToken');

      if (!accessToken) {
        console.log('no access token');
        const { signature, nonce } = await mutateAsync();
        accessToken =
          (await getAuthToken({ signature, nonce, pubkey: publicKey?.toBase58() })).data?.accessToken ?? null;

        if (!accessToken) throw new Error('Requst failed');
        localStorage.setItem('accessToken', accessToken);
      }

      return accessToken;
    },
  });
};
