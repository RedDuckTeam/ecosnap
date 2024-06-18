import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { NavLink } from 'react-router-dom';

import { TextLogo } from '../icons/text-logo';

export const Header = () => {
  return (
    <div className="flex justify-between items-center p-4">
      <div className="flex items-center gap-4">
        <NavLink to={'/'} className="flex items-center gap-3">
          <img alt="logo" src="/images/logo.png" className="xl:w-10 xl:h-10" />
          <TextLogo className="max-xl:w-[63px]" />
        </NavLink>
      </div>
      <div className="[&_button]:bg-transparent wallet-button [&_button]:hover:bg-transparent [&_img]:rounded-full">
        <WalletMultiButton />
      </div>
    </div>
  );
};
