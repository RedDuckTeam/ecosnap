import { LAMPORTS_PER_SOL } from '@solana/web3.js';
import { useMemo } from 'react';

import { useSolanaBalance } from '@/hooks/queries/use-solana-balance';

export const TokensAvailable = () => {
  const { data: solanaBalanceRes } = useSolanaBalance();

  console.log(solanaBalanceRes);

  const solanaBalance = useMemo(() => {
    return solanaBalanceRes ? solanaBalanceRes / LAMPORTS_PER_SOL : 0;
  }, [solanaBalanceRes]);
  return (
    <div className="flex w-full flex-col gap-4 leading-none">
      <h2 className="text-light font-semibold text-[16px]">Tokens available</h2>
      <div className="w-full relative  rounded-[16px] p-4 overflow-hidden flex items-center justify-between">
        <img src="/images/solana-bg.png" className="absolute -z-10 left-0 opacity-[0.07]" />
        <div className="flex items-center gap-3">
          <img src="/images/solana.png" alt="solana" className="h-6 w-6" />
          <p className="text-[24px] font-semibold">SOL</p>
        </div>
        <p className="text-[14px] font-semibold">{solanaBalance}</p>
      </div>
    </div>
  );
};
