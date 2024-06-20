import { useWallet } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { useMemo } from 'react';
import { NavLink } from 'react-router-dom';

import { TextLogo } from '../icons/text-logo';

import { generateBlockies } from '@/lib/blockies';

export const Header = () => {
  const { publicKey } = useWallet();
  useMemo(() => {
    localStorage.setItem('accessToken', '');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [publicKey]);
  return (
    <div className="flex justify-between items-center p-4">
      <div className="flex items-center gap-4">
        <NavLink to={'/'} className="flex items-center gap-3">
          <img alt="logo" src="/images/logo.png" className="xl:w-10 xl:h-10 w-8 h-8" />
          <TextLogo className="max-xl:w-[63px]" />
        </NavLink>
      </div>
      <div className="[&_button]:bg-transparent wallet-button flex items-center [&_button]:hover:bg-transparent">
        {generateBlockies(publicKey)}
        <WalletMultiButton />
      </div>
    </div>
  );
};
