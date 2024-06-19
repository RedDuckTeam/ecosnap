import { useWallet } from '@solana/wallet-adapter-react';
import { useQuery } from '@tanstack/react-query';

import type { UserCoupon } from '@/api/get/user-coupons';
import { getUserCoupons } from '@/api/get/user-coupons';

export type MyCoupon = UserCoupon['coupon'] & { isRedeemed: boolean };

export const useGetMyItems = () => {
  const { publicKey } = useWallet();

  return useQuery({
    queryKey: ['my-items', publicKey],
    queryFn: async () => {
      if (!publicKey) return [];

      const { coupons } = await getUserCoupons(publicKey.toBase58());

      return coupons.map((c) => ({ ...c.coupon, isRedeemed: c.isRedeemed }));
    },
  });
};
