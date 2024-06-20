import { useWallet } from '@solana/wallet-adapter-react';

import { useGetMyPoints } from '@/hooks/queries/use-get-my-points';
import { generateBlockies } from '@/lib/blockies';
import { shortenAddress } from '@/lib/utils';

export const MarketBar = () => {
  const { publicKey } = useWallet();
  const { data: points } = useGetMyPoints();

  return publicKey ? (
    <div className="max-xl:hidden w-full bg-gray-blue flex flex-col gap-[24px] rounded-[22px] p-[14px] items-center">
      <div className="flex flex-col items-center gap-[8px]">
        {generateBlockies(publicKey)}
        <div className="text-[20px] leading-[25px] tracking-[-0.5px] font-semibold">
          {shortenAddress(publicKey.toBase58())}
        </div>
      </div>
      <div className="flex flex-col gap-[8px]">
        <div className="bg-background rounded-[8px] p-[24px] gap-[8px] flex flex-col items-center justify-center">
          <div className="text-[16px] leading-[20px] tracking-[-0.5px] text-gray font-medium">Earned Points</div>
          <div className="flex items-center justify-center gap-[8px]">
            <img src="/images/star.png" alt="star" />
            <div className="text-[20px] leading-[25px] font-semibold tracking-[-0.5px]">{points ?? 0}</div>
          </div>
        </div>
      </div>
    </div>
  ) : null;
};
