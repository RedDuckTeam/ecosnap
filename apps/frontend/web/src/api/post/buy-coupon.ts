import { httpClient } from '../client';

const POST_BUY_COUPON = '/api/coupons/buy';

export interface BuyCouponRequest {
  couponId: string;
  signature: string;
  jwt: string;
}

export const postBuyCoupon = async ({ couponId, jwt, signature }: BuyCouponRequest) => {
  const response = await httpClient.post(
    POST_BUY_COUPON,
    {
      couponId,
      signature,
    },
    {
      Authorization: `Bearer ${jwt}`,
    }
  );

  if (response.data) {
    return response.data;
  }

  throw new Error('Failed to buy coupon');
};
