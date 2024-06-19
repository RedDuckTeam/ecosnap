import { useWallet } from '@solana/wallet-adapter-react';

export const NFTs = () => {
  const { publicKey } = useWallet();
  return (
    <div className="flex flex-col gap-4 w-full">
      <h2 className="text-light font-semibold text-[16px]">NFT’s Earned</h2>
      <div className={`${publicKey ? '' : 'grayscale-[95%]'} grid grid-cols-2 gap-y-4`}>
        <div className="flex items-end">
          <img src="/images/girl_01.png" alt="girl" className="w-full -translate-x-[15%]" />
        </div>
        <div className="flex items-end">
          <img src="/images/girl_02.png" alt="girl" className="w-full" />
        </div>
        <div className="flex items-end">
          <img src="/images/girl_03.png" alt="girl" className="w-full -translate-x-[15%]" />
        </div>
        <div className="flex items-end">
          <img src="/images/girl_04.png" alt="girl" className="w-full" />
        </div>
      </div>
    </div>
  );
};
