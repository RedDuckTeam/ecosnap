import { Suspense, memo } from 'react';
import { Outlet } from 'react-router-dom';

import { Footer } from '@/components/footer/footer';
import { Header } from '@/components/header/header';
import { Links } from '@/components/header/links';
import { PageLoader } from '@/components/page-loader/page-loader';
import { Toaster } from '@/components/ui/toaster';
import Providers from '@/providers/Providers';

const DefaultLayout = memo(() => {
  return (
    <Providers>
      <div className="min-h-screen flex pb-[136px] xl:pb-4 flex-1 max-w-[1375px] mx-auto flex-col">
        <Header />
        <div className="relative font-quicksand">
          <Links />
          <Suspense fallback={<PageLoader />}>
            <Outlet />
          </Suspense>
        </div>
        <Footer />
      </div>
      <Toaster />
    </Providers>
  );
});
DefaultLayout.displayName = 'DefaultLayout';

export default DefaultLayout;
