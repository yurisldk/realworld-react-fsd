import type { RouteObject } from 'react-router';
import { requireAuthMiddleware } from '~shared/lib/react-router/requireAuthMiddleware';
import { homePaths } from './home.paths';

export const homeRoute = {
  path: '/',
  lazy: async () => {
    const [{ HomePage: Component }, { homePageLoader: loader }] = await Promise.all([
      import('~pages/home/home.ui'),
      import('~pages/home/home.loader'),
    ]);

    return { Component, loader };
  },
  children: [
    {
      path: homePaths.favoriteToggle,
      middleware: [requireAuthMiddleware],
      lazy: async () => {
        const { articleFavoriteToggleAction: action } = await import(
          '~pages/home/actions/article-favorite-toggle.action'
        );
        return { action };
      },
    },
  ],
} satisfies RouteObject;
