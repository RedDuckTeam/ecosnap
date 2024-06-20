import { useWallet } from '@solana/wallet-adapter-react';
import { useQuery } from '@tanstack/react-query';

import { getUserAchievements } from '@/api/get/achievements';

export const useGetUserAchievements = () => {
  const { publicKey } = useWallet();
  return useQuery({
    queryKey: ['achievements', publicKey],
    queryFn: async () => {
      if (!publicKey) return;

      const events = await getUserAchievements({ user: publicKey?.toBase58() });

      return events.data?.achievements;
    },
  });
};
