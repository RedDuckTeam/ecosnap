import { NavLink, useLocation, useNavigate } from 'react-router-dom';

import { Events } from '../icons/events';
import { Home } from '../icons/home';
import { Market } from '../icons/market';
import { Message } from '../icons/message';
import { Button } from '../ui/button';

import { routes } from '@/router';
import { useWallet } from '@solana/wallet-adapter-react';

export const config = [
  { label: 'Home', link: routes.root, icon: <Home /> },
  { label: 'Posts', link: routes.posts, icon: <Message /> },
  { label: 'Events', link: routes.events, icon: <Events /> },
  { label: 'Market', link: '/photo', icon: <Market /> },
];

export const Links = () => {
  const navigate = useNavigate();
  const { publicKey } = useWallet();
  const pathname = useLocation().pathname;
  return (
    <div className="flex flex-col absolute top-0 left-4  gap-8">
      <nav className="flex-col hidden max-w-[180px] xl:flex col-span-1 bg-gray-blue rounded-[22px] px-4 py-5 gap-4">
        {config.map((link) => (
          <NavLink
            key={link.label}
            to={link.link}
            className={`${pathname === link.link ? '[&_path]:fill-primary' : '[&:hover_path]:fill-primary/80'} flex  transition-all  p-2 pr-10 items-center gap-3`}
          >
            <div className="w-7 flex justify-center relative">
              {pathname === link.link && (
                <div className="rounded-full absolute -translate-x-1/2 -translate-y-1/2 bg-primary/20 -z-0 h-[1px] w-[1px] left-1/2 top-1/2 shadow-glow-xl"></div>
              )}
              {link.icon}
            </div>
            <p className="text-[16px] leading-[20px] font-semibold">{link.label}</p>
          </NavLink>
        ))}
      </nav>
      {pathname === routes.posts && (
        <Button onClick={() => navigate(routes.newPost)} disabled={!publicKey} className="w-full max-xl:hidden  py-5">
          New Post
        </Button>
      )}
    </div>
  );
};
