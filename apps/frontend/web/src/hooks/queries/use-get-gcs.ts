import { useQuery } from '@tanstack/react-query';

import { getGcs } from '@/api/get/gcs';

export const useGetGcs = () => {
  return useQuery({
    queryKey: ['gcs'],
    queryFn: async () => {
      const gcs = await getGcs();
      return gcs.data || null;
    },
  });
};
