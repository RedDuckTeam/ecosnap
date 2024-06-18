import { NavLink } from 'react-router-dom';

const config = [
  { label: 'Home', link: '/', icon: <div></div> },
  { label: 'Upload photo', link: '/photo', icon: <div></div> },
  { label: 'Events', link: '/events', icon: <div></div> },
];

export const Links = () => {
  return (
    <nav className="flex items-center gap-3">
      {config.map((link) => (
        <NavLink key={link.label} to={link.link} className="flex items-center gap-1.5">
          {link.icon}
          <span className="text-[16px] leading-[30px]">{link.label}</span>
        </NavLink>
      ))}
    </nav>
  );
};
