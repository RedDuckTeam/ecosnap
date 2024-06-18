import { lazy } from 'react';
import { createBrowserRouter } from 'react-router-dom';

export const routes = {
  root: '/',
  photo: '/photo',
  posts: '/posts',
  newPost: '/new-post',
  events: '/events',
  event: '/events/:id',
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
        path: routes.posts,
        Component: lazy(() => import('@/pages/posts')),
      },
      {
        path: routes.newPost,
        Component: lazy(() => import('@/pages/new-post')),
      },
      {
        path: routes.events,
        Component: lazy(() => import('@/pages/events')),
      },
      {
        path: routes.event,
        Component: lazy(() => import('@/pages/events/[id]')),
      },
    ],
  },
]);
