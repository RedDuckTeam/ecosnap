import { useWallet } from '@solana/wallet-adapter-react';
import { useQuery } from '@tanstack/react-query';

import { getUserGcs } from '@/api/get/user-gcs';

export const useGetUserGcs = () => {
  const { publicKey } = useWallet();

  return useQuery({
    queryKey: ['gcs', publicKey],
    queryFn: async () => {
      const gcs = await getUserGcs(publicKey!.toBase58());
      return gcs;
    },
    enabled: !!publicKey,
  });
};
