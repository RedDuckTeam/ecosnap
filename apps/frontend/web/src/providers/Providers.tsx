import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import type { FC, PropsWithChildren } from 'react';

import WalletProvider from './WalletProvider';

import { TooltipProvider } from '@/components/ui/tooltip';

const queryClient = new QueryClient();

const Providers: FC<PropsWithChildren> = ({ children }) => {
  return (
    <TooltipProvider>
      <WalletProvider>
        <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
      </WalletProvider>
    </TooltipProvider>
  );
};

export default Providers;
