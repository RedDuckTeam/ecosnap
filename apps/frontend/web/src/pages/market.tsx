import { useAutoAnimate } from '@formkit/auto-animate/react';
import { useWallet } from '@solana/wallet-adapter-react';
import { Loader2 } from 'lucide-react';
import { useCallback, useMemo, useState } from 'react';
import QRCode from 'react-qr-code';

import { Button } from '@/components/ui/button';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useGetItems, type Item } from '@/hooks/queries/use-get-items';
import type { MyItem } from '@/hooks/queries/use-get-my-items';
import { useGetMyItems } from '@/hooks/queries/use-get-my-items';
import { useGetMyPoints } from '@/hooks/queries/use-get-my-points';
import { generateBlockies } from '@/lib/blockies';
import { shortenAddress } from '@/lib/utils';

interface MarketCardProps {
  item: Item;
  setItem: (item: Item) => void;
  setOpen: (open: boolean) => void;
  points: number;
}

const MarketCard = ({ item, setItem, setOpen, points }: MarketCardProps) => {
  const openExchangeDialog = useCallback(() => {
    if (points < item.price) {
      return;
    }
    setItem(item);
    setOpen(true);
  }, [item, setItem, setOpen, points]);

  return (
    <div className="bg-gray-blue rounded-[16px] p-[24px] flex items-center gap-[16px]">
      <img src={item.imageUrl} alt={item.name} className="rounded-[19px] w-[140px] h-[120px]" />
      <div className="flex flex-col justify-between h-full">
        <div className="flex flex-col gap-[8px]">
          <div className="text-[20px] leading-[25px] font-semibold tracking-[-0.5px]">{item.name}</div>
          <div className="flex items-center gap-[8px]">
            <img src="/images/star.png" alt="star" />
            <div className="text-[16px] leading-[20px] tracking-[-0.5px] font-medium text-gray">
              <span className={points >= item.price ? 'text-foreground' : 'text-[#FE4756]'}>{points}</span>/{item.price}
            </div>
          </div>
        </div>
        <Button
          className="px-[24px] py-[12px] text-[14px] leading-[17.5px] tracking-[-0.5px] w-fit"
          onClick={openExchangeDialog}
          disabled={points < item.price}
        >
          Exchange
        </Button>
      </div>
    </div>
  );
};

interface ExchangeDialogProps extends Omit<MarketCardProps, 'setItem' | 'points'> {
  open: boolean;
}

enum ExchangeDialogState {
  Confirm = 'confirm',
  Success = 'success',
}

const ExchangeDialog = ({ item, open, setOpen }: ExchangeDialogProps) => {
  const [parent] = useAutoAnimate();
  const [state, setState] = useState(ExchangeDialogState.Confirm);

  const closeDialog = useCallback(() => {
    setOpen(false);
    setTimeout(() => setState(ExchangeDialogState.Confirm), 100);
  }, [setOpen]);

  const exchange = useCallback(() => {
    setState(ExchangeDialogState.Success);
  }, []);

  const steps = useMemo(
    () => ({
      [ExchangeDialogState.Confirm]: (
        <>
          <div className="text-[24px] leading-[30px] tracking-[-0.5px] font-semibold">{item.name}</div>
          <img src={item.imageUrl} alt={item.name} className="rounded-[19px] w-[164px] h-[164px]" />
          <div className="text-[16px] leading-[22px] tracking-[-0.5px] text-gray text-center font-medium">
            {item.description}
          </div>
          <div className="flex items-center justify-center gap-[4px] rounded-[11px] p-[12px] bg-background w-full">
            <img src="/images/star.png" alt="star" />
            <div className="text-[16px] leading-[20px] tracking-[-0.5px] font-semibold">{item.price}</div>
          </div>
          <div className="flex items-center gap-[8px] w-full">
            <Button
              className="flex-1 px-[16px] py-[12px] rounded-[13px] text-[14px] leading-[17.5px] tracking-[-0.5px] font-bold"
              variant="outline"
              onClick={closeDialog}
            >
              No
            </Button>
            <Button
              className="flex-1 px-[16px] py-[12px] rounded-[13px] text-[14px] leading-[17.5px] tracking-[-0.5px] font-bold"
              onClick={exchange}
            >
              Yes
            </Button>
          </div>
        </>
      ),
      [ExchangeDialogState.Success]: (
        <div className="flex flex-col items-center gap-[8px] w-full">
          <div className="text-[24px] leading-[30px] tracking-[-0.5px] font-semibold">Points exchanged</div>
          <div className="text-[16px] leading-[22px] tracking-[-0.5px] text-center font-medium text-gray">
            Successfully exchanged for <span className="font-semibold text-foreground">{item.name}</span>.
          </div>
          <Button onClick={closeDialog} className="mt-[16px] w-full">
            Ok
          </Button>
        </div>
      ),
    }),
    [item, closeDialog, exchange],
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

interface MyItemCardProps {
  myItem: MyItem;
  setMyItem: (myItem: MyItem) => void;
  setOpen: (open: boolean) => void;
}

const MyItemCard = ({ myItem, setMyItem, setOpen }: MyItemCardProps) => {
  const openQrDialog = useCallback(() => {
    setMyItem(myItem);
    setOpen(true);
  }, [myItem, setMyItem, setOpen]);

  return (
    <div className="bg-gray-blue rounded-[16px] p-[24px] flex items-center gap-[16px]">
      <img src={myItem.imageUrl} alt={myItem.name} className="rounded-[19px] w-[140px] h-[120px]" />
      <div className="flex flex-col justify-between h-full">
        <div className="flex flex-col gap-[8px]">
          <div className="text-[20px] leading-[25px] font-semibold tracking-[-0.5px]">{myItem.name}</div>
          <div className="flex items-center gap-[8px]">
            <img src="/images/star.png" alt="star" />
            <div className="text-[16px] leading-[20px] tracking-[-0.5px] font-medium text-gray">
              <span className="text-foreground">20</span>/{myItem.price}
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

interface QrDialogProps extends Omit<MyItemCardProps, 'setMyItem'> {
  open: boolean;
}

const QrDialog = ({ myItem, open, setOpen }: QrDialogProps) => {
  return (
    <Dialog
      open={open}
      onOpenChange={(open) => {
        setOpen(open);
      }}
    >
      <DialogContent className="p-[32px] max-w-[440px] gap-[24px] flex flex-col items-center">
        <div className="text-[24px] leading-[30px] tracking-[-0.5px] font-semibold">{myItem.name}</div>
        <div className="max-w-[295px] max-h-[295px] w-full h-full rounded-[19px] bg-background flex items-center justify-center">
          <QRCode
            value={myItem.id}
            className="rounded-[19px]"
            size={295}
            viewBox="0 0 295 295"
            style={{ height: 'auto', maxWidth: '100%', width: '100%' }}
            bgColor="#252945"
            fgColor="#28CCAF"
          />
        </div>
        <div className="text-[16px] leading-[22px] tracking-[-0.5px] text-gray text-center font-medium">
          Here&apos;s your QR code. Please scan it in the shop to make a purchase.
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default function Market() {
  const [parent] = useAutoAnimate();
  const [parent2] = useAutoAnimate();
  const [item, setItem] = useState<Item | null>(null);
  const [myItem, setMyItem] = useState<MyItem | null>(null);
  const [open, setOpen] = useState(false);
  const [myOpen, setMyOpen] = useState(false);
  const { data: items, isLoading: isLoadingItems } = useGetItems();
  const { data: myItems, isLoading: isLoadingMyItems } = useGetMyItems();
  const { data: points } = useGetMyPoints();
  const { publicKey } = useWallet();

  return (
    <main className="container">
      <div className="max-lg:flex hidden flex-col gap-[16px] rounded-[27px] p-[24px] bg-gray-blue mb-[24px]">
        <div className="flex items-center gap-[8px] justify-center">
          {generateBlockies(publicKey)}
          {publicKey && (
            <div className="text-[20px] leading-[25px] tracking-[-0.5px] font-semibold">
              {shortenAddress(publicKey.toBase58())}
            </div>
          )}
        </div>
        <div className="bg-background rounded-[16px] px-[16px] py-[8px] flex flex-col gap-[2px] items-center justify-center w-full">
          <div className="text-[12px] leading-[20px] tracking-[-0.5px] text-gray font-medium">Earned Points</div>
          <div className="flex items-center justify-center gap-[4px]">
            <img src="/images/star.png" alt="star" />
            <div className="text-[16px] leading-[20px] tracking-[-0.5px] font-semibold">{points ?? 0}</div>
          </div>
        </div>
      </div>
      {myItem && <QrDialog myItem={myItem} open={myOpen} setOpen={setMyOpen} />}
      {item && <ExchangeDialog item={item} open={open} setOpen={setOpen} />}
      <div className="flex xl:ml-[268px] flex-col items-center gap-12">
        <Tabs defaultValue="discover" className="w-full flex items-center flex-col">
          <TabsList className="mx-auto mb-[24px]">
            <TabsTrigger value="discover">Discover</TabsTrigger>
            <TabsTrigger value="my-items">My items</TabsTrigger>
          </TabsList>
          <TabsContent
            value="discover"
            className="w-full grid grid-cols-1 lg:grid-cols-2 gap-[8px] lg:gap-[16px]"
            ref={parent}
          >
            {isLoadingItems || !items || !points ? (
              <Loader2 className="mx-auto w-8 h-8 animate-spin" />
            ) : (
              items.map((item) => (
                <MarketCard key={item.id} item={item} setItem={setItem} setOpen={setOpen} points={points} />
              ))
            )}
          </TabsContent>
          <TabsContent
            value="my-items"
            className="w-full grid grid-cols-1 lg:grid-cols-2 gap-[8px] lg:gap-[16px]"
            ref={parent2}
          >
            {isLoadingMyItems || !myItems ? (
              <Loader2 className="mx-auto w-8 h-8 animate-spin" />
            ) : (
              myItems.map((myItem) => (
                <MyItemCard key={myItem.id} myItem={myItem} setMyItem={setMyItem} setOpen={setMyOpen} />
              ))
            )}
          </TabsContent>
        </Tabs>
      </div>
    </main>
  );
}
