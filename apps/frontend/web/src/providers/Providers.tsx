import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import type { FC, PropsWithChildren } from 'react';
import WalletProvider from './WalletProvider';

const queryClient = new QueryClient();

const Providers: FC<PropsWithChildren> = ({ children }) => {
  return (
    <WalletProvider>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </WalletProvider>
  );
};

export default Providers;
