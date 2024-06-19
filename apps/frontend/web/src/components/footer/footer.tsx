import { NavLink, useLocation } from 'react-router-dom';

import { config } from '../header/links';

export const Footer = () => {
  const pathname = useLocation().pathname;

  return (
    <nav className="xl:hidden w-full flex justify-around py-4 fixed bottom-0 left-0 bg-gray-blue">
      {config.map((link) => (
        <NavLink
          key={link.label}
          to={link.link}
          className={`${pathname === link.link ? '[&_path]:fill-primary' : '[&:hover_path]:fill-primary/80'} relative flex justify-center transition-all  p-4 items-center`}
        >
          {pathname === link.link && (
            <div className="rounded-full absolute -translate-x-1/2 -translate-y-1/2 bg-primary/20 -z-10 h-[1px] w-[1px] left-1/2 top-1/2 shadow-glow-xl"></div>
          )}
          <div className="w-7 flex justify-center">{link.icon}</div>
        </NavLink>
      ))}
    </nav>
  );
};
