import { useCallback } from 'react';

import { Button } from '@/components/ui/button';
import type { MyCoupon } from '@/hooks/queries/use-get-my-items';

export interface MyItemCardProps {
  myItem: MyCoupon;
  setMyItem: (myItem: MyCoupon) => void;
  setOpen: (open: boolean) => void;
}

export const MyItemCard = ({ myItem, setMyItem, setOpen }: MyItemCardProps) => {
  const openQrDialog = useCallback(() => {
    setMyItem(myItem);
    setOpen(true);
  }, [myItem, setMyItem, setOpen]);

  return (
    <div className="bg-gray-blue rounded-[16px] p-[24px] flex items-center gap-[16px]">
      <img src={myItem.imageUrl} alt={myItem.description} className="rounded-[19px] w-[140px] h-[120px]" />
      <div className="flex flex-col justify-between h-full">
        <div className="flex flex-col gap-[8px]">
          <div className="text-[20px] leading-[25px] font-semibold tracking-[-0.5px]">{myItem.description}</div>
          <div className="flex items-center gap-[8px]">
            <img src="/images/star.png" alt="star" />
            <div className="text-[16px] leading-[20px] tracking-[-0.5px] font-medium text-gray">
              <span className="text-foreground">20</span>/{myItem.pointsPrice}
            </div>
          </div>
        </div>
        {myItem.isRedeemed ? (
          <Button
            variant="destructive"
            className="px-[24px] py-[12px] text-[14px] leading-[17.5px] tracking-[-0.5px] w-fit rounded-[13px]"
          >
            Used
          </Button>
        ) : (
          <button className="w-fit" onClick={openQrDialog}>
            <img src="/images/barcode.svg" alt="barcode" />
          </button>
        )}
      </div>
    </div>
  );
};
