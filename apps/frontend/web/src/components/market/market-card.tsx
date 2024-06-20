import { useCallback } from 'react';

import type { Coupon } from '@/api/get/coupons';
import { Button } from '@/components/ui/button';

export interface MarketCardProps {
  item: Coupon;
  setItem: (item: Coupon) => void;
  setOpen: (open: boolean) => void;
  points: number;
}

export const MarketCard = ({ item, setItem, setOpen, points }: MarketCardProps) => {
  const openExchangeDialog = useCallback(() => {
    if (points < item.pointsPrice) {
      return;
    }
    setItem(item);
    setOpen(true);
  }, [item, setItem, setOpen, points]);

  return (
    <div className="bg-gray-blue rounded-[16px] p-[24px] flex items-center gap-[16px]">
      <img src={item.imageUrl} alt={item.description} className="rounded-[19px] w-[140px] h-[120px]" />
      <div className="flex flex-col justify-between h-full">
        <div className="flex flex-col gap-[8px]">
          <div className="text-[20px] leading-[25px] font-semibold tracking-[-0.5px]">{item.description}</div>
          <div className="flex items-center gap-[8px]">
            <img src="/images/star.png" alt="star" />
            <div className="text-[16px] leading-[20px] tracking-[-0.5px] font-medium text-gray">
              <span className={points >= item.pointsPrice ? 'text-foreground' : 'text-[#FE4756]'}>{points}</span>/
              {item.pointsPrice}
            </div>
          </div>
        </div>
        <Button
          className="px-[24px] py-[12px] text-[14px] leading-[17.5px] tracking-[-0.5px] w-fit"
          onClick={openExchangeDialog}
          disabled={points < item.pointsPrice}
        >
          Exchange
        </Button>
      </div>
    </div>
  );
};
