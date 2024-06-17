import { Suspense, memo } from 'react';
import { Outlet } from 'react-router-dom';
import { Toaster } from '@/components/ui/toaster';
import { Header } from '@/components/header/header';
import { PageLoader } from '@/components/page-loader/page-loader';
import Providers from '@/providers/Providers';
import { Footer } from '@/components/footer/footer';

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
