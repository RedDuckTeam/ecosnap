import { useWallet } from '@solana/wallet-adapter-react';
import { useMutation } from '@tanstack/react-query';
import { encode } from 'bs58';

import { postBuyCoupon } from '@/api/post/buy-coupon';
import { useAuth } from '@/hooks/mutations/use-auth';

export interface UseBuyCouponParams {
  couponId: string;
}

export const useBuyCoupon = () => {
  const { publicKey, signMessage } = useWallet();
  const { mutateAsync: auth } = useAuth();

  return useMutation({
    mutationFn: async ({ couponId }: UseBuyCouponParams) => {
      if (!publicKey || !signMessage) {
        throw new Error('Wallet not connected');
      }

      const jwt = await auth();
      const message = new TextEncoder().encode(`Confirming coupon buy for: ${couponId}`);
      const signature = encode(await signMessage(message));

      return await postBuyCoupon({ couponId, jwt, signature });
    },
  });
};
