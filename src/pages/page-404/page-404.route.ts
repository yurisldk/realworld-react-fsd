import type { RouteObject } from 'react-router';

export const page404Route = {
  path: '/404',
  lazy: async () => {
    const { Page404: Component } = await import('~pages/page-404/page-404.ui');

    return { Component };
  },
} satisfies RouteObject;
