import { memo, Suspense } from 'react';
import { RouterProvider } from 'react-router-dom';

import { PageLoader } from '@/components/page-loader/page-loader';
import { router } from '@/router';

export const LazyRouterProvider = memo(() => {
  return (
    <Suspense fallback={<PageLoader />}>
      <RouterProvider router={router} />
    </Suspense>
  );
});
LazyRouterProvider.displayName = 'LazyRouterProvider';
