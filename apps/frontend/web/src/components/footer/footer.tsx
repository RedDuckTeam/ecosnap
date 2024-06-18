import { NavLink, useLocation } from 'react-router-dom';

import { config } from '../header/links';

export const Footer = () => {
  const pathname = useLocation().pathname;

  return (
    <nav className="xl:hidden w-full flex justify-around pt-4 pb-10 fixed bottom-0 left-0 bg-gray-blue">
      {config.map((link) => (
        <NavLink
          key={link.label}
          to={link.link}
          className={`${pathname === link.link ? '[&_path]:fill-primary' : '[&:hover_path]:fill-primary/80'} flex justify-center transition-all  p-4 items-center`}
        >
          <div className="w-7 flex justify-center">{link.icon}</div>
        </NavLink>
      ))}
    </nav>
  );
};
