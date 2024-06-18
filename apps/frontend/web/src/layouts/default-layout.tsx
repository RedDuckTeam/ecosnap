import { Suspense, memo } from 'react';
import { Outlet } from 'react-router-dom';

import { Footer } from '@/components/footer/footer';
import { Header } from '@/components/header/header';
import { PageLoader } from '@/components/page-loader/page-loader';
import { Toaster } from '@/components/ui/toaster';
import Providers from '@/providers/Providers';

const DefaultLayout = memo(() => {
  return (
    <Providers>
      <div className="min-h-screen flex flex-col">
        <Header />
        <Suspense fallback={<PageLoader />}>
          <Outlet />
        </Suspense>
        <Footer />
      </div>
      <Toaster />
    </Providers>
  );
});
DefaultLayout.displayName = 'DefaultLayout';

export default DefaultLayout;
