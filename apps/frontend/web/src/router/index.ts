import { lazy } from 'react';
import { createBrowserRouter } from 'react-router-dom';

export const routes = {
  root: '/',
  photo: '/photo',
  profile: '/profile',
} as const;

export const router = createBrowserRouter([
  {
    path: routes.root,
    Component: lazy(() => import('@/layouts/default-layout')),
    children: [
      {
        path: routes.root,
        Component: lazy(() => import('@/pages/home')),
      },
      {
        path: routes.photo,
        Component: lazy(() => import('@/pages/photo')),
      },
      {
        path: routes.profile,
        Component: lazy(() => import('@/pages/profile')),
      },
    ],
  },
]);
