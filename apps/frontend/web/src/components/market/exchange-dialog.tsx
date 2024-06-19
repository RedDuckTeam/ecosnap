import { useAutoAnimate } from '@formkit/auto-animate/react';
import { useQueryClient } from '@tanstack/react-query';
import { useState, useCallback, useMemo } from 'react';

import { useToast } from '../ui/use-toast';

import type { MarketCardProps } from '@/components/market/market-card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { useBuyCoupon } from '@/hooks/mutations/use-buy-coupon';

export interface ExchangeDialogProps extends Omit<MarketCardProps, 'setItem' | 'points'> {
  open: boolean;
}

export enum ExchangeDialogState {
  Confirm = 'confirm',
  Success = 'success',
}

export const ExchangeDialog = ({ item, open, setOpen }: ExchangeDialogProps) => {
  const [parent] = useAutoAnimate();
  const [state, setState] = useState(ExchangeDialogState.Confirm);
  const { mutateAsync: buyCoupon, isPending } = useBuyCoupon();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const closeDialog = useCallback(() => {
    if (isPending) return;
    setOpen(false);
    setTimeout(() => setState(ExchangeDialogState.Confirm), 100);
  }, [setOpen, isPending]);

  const exchange = useCallback(async () => {
    try {
      if (isPending) return;
      await buyCoupon({ couponId: item.id });
      for (const queryKey of ['items', 'my-items', 'user', 'my-points']) {
        // eslint-disable-next-line @typescript-eslint/no-floating-promises
        queryClient.invalidateQueries({ queryKey: [queryKey] });
      }
      setState(ExchangeDialogState.Success);
    } catch (error) {
      console.error(error);
      toast({
        variant: 'destructive',
        title: 'Failed to exchange points',
        description: error instanceof Error ? error.message : 'An error occurred',
      });
      return;
    }
  }, [buyCoupon, item.id, toast, isPending, queryClient]);

  const steps = useMemo(
    () => ({
      [ExchangeDialogState.Confirm]: (
        <>
          <div className="text-[24px] leading-[30px] tracking-[-0.5px] font-semibold">{item.description}</div>
          <img src={item.imageUrl} alt={item.description} className="rounded-[19px] w-[164px] h-[164px]" />
          <div className="flex items-center justify-center gap-[4px] rounded-[11px] p-[12px] bg-background w-full">
            <img src="/images/star.png" alt="star" />
            <div className="text-[16px] leading-[20px] tracking-[-0.5px] font-semibold">{item.pointsPrice}</div>
          </div>
          <div className="flex items-center gap-[8px] w-full">
            <Button
              className="flex-1 px-[16px] py-[12px] rounded-[13px] text-[14px] leading-[17.5px] tracking-[-0.5px] font-bold"
              variant="outline"
              onClick={closeDialog}
              disabled={isPending}
            >
              {isPending ? 'Loading...' : 'No'}
            </Button>
            <Button
              className="flex-1 px-[16px] py-[12px] rounded-[13px] text-[14px] leading-[17.5px] tracking-[-0.5px] font-bold"
              onClick={exchange}
              disabled={isPending}
            >
              {isPending ? 'Loading...' : 'Yes'}
            </Button>
          </div>
        </>
      ),
      [ExchangeDialogState.Success]: (
        <div className="flex flex-col items-center gap-[8px] w-full">
          <div className="text-[24px] leading-[30px] tracking-[-0.5px] font-semibold">Points exchanged</div>
          <div className="text-[16px] leading-[22px] tracking-[-0.5px] text-center font-medium text-gray">
            Successfully exchanged for <span className="font-semibold text-foreground">{item.description}</span>.
          </div>
          <Button onClick={closeDialog} className="mt-[16px] w-full">
            Ok
          </Button>
        </div>
      ),
    }),
    [item, closeDialog, exchange, isPending],
  );

  return (
    <Dialog
      open={open}
      onOpenChange={(open) => {
        setOpen(open);
        if (!open) setTimeout(() => setState(ExchangeDialogState.Confirm), 100);
      }}
    >
      <DialogContent className="p-[32px] max-w-[440px]">
        <div ref={parent} className="flex flex-col items-center gap-[24px]">
          {steps[state]}
        </div>
      </DialogContent>
    </Dialog>
  );
};
