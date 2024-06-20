import { httpClient } from '../client';

const GET_COUPONS = 'api/coupons';

export type Coupon = {
  id: string;
  description: string;
  pointsPrice: number;
  imageUrl: string;
  createdAt: string;
  updatedAt: string;
};

export type GetCouponsReturnType = {
  coupons: Coupon[];
};

export const getCoupons = async () => {
  const response = await httpClient.get<GetCouponsReturnType>(GET_COUPONS);

  if (!response.data) {
    return { coupons: [] };
  }
  return response.data;
};
