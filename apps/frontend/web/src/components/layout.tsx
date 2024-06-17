import { Plus_Jakarta_Sans } from 'next/font/google';

import { Navbar } from './navbar/navbar';

import { Toaster } from '@/components/ui/toaster';

const plusJakartaSans = Plus_Jakarta_Sans({ subsets: ['latin'] });

interface Props {
  children: React.ReactNode;
}

export const Layout = ({ children }: Props) => {
  return (
    <div className={plusJakartaSans.className}>
      <Navbar />
      {children}
      <Toaster />
    </div>
  );
};
