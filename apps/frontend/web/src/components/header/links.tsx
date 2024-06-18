import { NavLink, useLocation } from 'react-router-dom';

import { Events } from '../icons/events';
import { Home } from '../icons/home';
import { Market } from '../icons/market';
import { Message } from '../icons/message';

import { routes } from '@/router';

export const config = [
  { label: 'Home', link: routes.root, icon: <Home /> },
  { label: 'Posts', link: routes.posts, icon: <Message /> },
  { label: 'Events', link: '/photo', icon: <Events /> },
  { label: 'Market', link: '/photo', icon: <Market /> },
];

export const Links = () => {
  const pathname = useLocation().pathname;

  return (
    <nav className="flex-col hidden absolute top-0 left-4 max-w-[180px] xl:flex col-span-1 bg-gray-blue rounded-[22px] px-4 py-5 gap-4">
      {config.map((link) => (
        <NavLink
          key={link.label}
          to={link.link}
          className={`${pathname === link.link ? '[&_path]:fill-primary' : '[&:hover_path]:fill-primary/80'} flex  transition-all  p-2 pr-10 items-center gap-3`}
        >
          <div className="w-7 flex justify-center">{link.icon}</div>
          <p className="text-[16px] leading-[20px] font-semibold">{link.label}</p>
        </NavLink>
      ))}
    </nav>
  );
};
