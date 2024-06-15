import { Plus_Jakarta_Sans } from 'next/font/google';

const plusJakartaSans = Plus_Jakarta_Sans({ subsets: ['latin'] });

interface Props {
  children: React.ReactNode;
}

export const Layout = ({ children }: Props) => {
  return (
    <div className={plusJakartaSans.className}>
      <button>SDASIDOASODH</button>asdasdsa{children}
    </div>
  );
};
