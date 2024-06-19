import { useQuery } from '@tanstack/react-query';

import { timeout } from '@/lib/timeout';

export const useGetMyPoints = () => {
  return useQuery({
    queryKey: ['my-points'],
    queryFn: async () => {
      await timeout(1000);
      return 1000;
    },
  });
};
