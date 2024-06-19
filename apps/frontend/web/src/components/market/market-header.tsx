import { useWallet } from '@solana/wallet-adapter-react';

import { useGetMyPoints } from '@/hooks/queries/use-get-my-points';
import { generateBlockies } from '@/lib/blockies';
import { shortenAddress } from '@/lib/utils';

export const MarketHeader = () => {
  const { data: points } = useGetMyPoints();
  const { publicKey } = useWallet();

  return (
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
  );
};
