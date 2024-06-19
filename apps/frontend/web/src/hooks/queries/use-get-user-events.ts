import { useWallet } from '@solana/wallet-adapter-react';
import { useQuery } from '@tanstack/react-query';

import { getUserEvents } from '@/api/get/user-events';

export const useGetUserEvents = (cityId: string, search: string) => {
  const { publicKey } = useWallet();
  return useQuery({
    queryKey: ['events', publicKey, cityId, search],
    queryFn: async () => {
      const events = await getUserEvents(publicKey!.toBase58());

      const filteredEvents = events.data?.events?.filter?.((e) => {
        if (cityId && e.city !== cityId) {
          return false;
        }

        if (search && !e.name.toLowerCase().includes(search.toLowerCase())) {
          return false;
        }

        return true;
      });
      return filteredEvents;
    },
    enabled: !!publicKey,
  });
};
