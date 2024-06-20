import { useQuery } from '@tanstack/react-query';

import { getCoupons } from '@/api/get/coupons';

export const useGetItems = () => {
  return useQuery({
    queryKey: ['items'],
    queryFn: async () => {
      const data = await getCoupons();
      return data.coupons;
    },
  });
};
