import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { NavLink } from 'react-router-dom';

import { Links } from './links';

export const Header = () => {
  return (
    <div className="flex justify-between items-center">
      <div className="flex items-center gap-4">
        <NavLink to={'/'}>LOGO</NavLink>
        <Links />
      </div>
      <WalletMultiButton />
    </div>
  );
};
