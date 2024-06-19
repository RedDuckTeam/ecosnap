import type { Coupon } from './coupons';

import { httpClient } from '../client';

const GET_USER_COUPONS = '/api/coupons/user';

export type UserCoupon = {
  id: string;
  coupon: Coupon;
  createdAt: string;
  isRedeemed: boolean;
};

export type UserCoupons = {
  coupons: UserCoupon[];
};

export const getUserCoupons = async (pubKey: string): Promise<UserCoupons> => {
  const data = await httpClient.get<UserCoupons>(`${GET_USER_COUPONS}?pubKey=${pubKey}`);
  if (!data.data) throw new Error('Failed to get user coupons');
  return data.data;
};
