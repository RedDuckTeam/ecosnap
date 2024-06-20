import { useAutoAnimate } from '@formkit/auto-animate/react';
import { Loader2 } from 'lucide-react';
import { useState } from 'react';

import type { Coupon } from '@/api/get/coupons';
import { ExchangeDialog } from '@/components/market/exchange-dialog';
import { MarketCard } from '@/components/market/market-card';
import { MarketHeader } from '@/components/market/market-header';
import { MyItemCard } from '@/components/market/my-item-card';
import { QrDialog } from '@/components/market/qr-dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useGetItems } from '@/hooks/queries/use-get-items';
import type { MyCoupon } from '@/hooks/queries/use-get-my-items';
import { useGetMyItems } from '@/hooks/queries/use-get-my-items';
import { useGetMyPoints } from '@/hooks/queries/use-get-my-points';

export default function Market() {
  const [parent] = useAutoAnimate();
  const [parent2] = useAutoAnimate();
  const [item, setItem] = useState<Coupon | null>(null);
  const [myItem, setMyItem] = useState<MyCoupon | null>(null);
  const [open, setOpen] = useState(false);
  const [myOpen, setMyOpen] = useState(false);
  const { data: items, isLoading: isLoadingItems } = useGetItems();
  const { data: myItems, isLoading: isLoadingMyItems } = useGetMyItems();
  const { data: points } = useGetMyPoints();

  return (
    <main className="container">
      <MarketHeader />
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
