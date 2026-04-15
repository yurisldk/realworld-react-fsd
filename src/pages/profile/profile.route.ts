import type { RouteObject } from 'react-router';
import { requireAuthMiddleware } from '~shared/lib/react-router/requireAuthMiddleware';
import { profilePaths } from './profile.paths';

export const profileRoute = {
  path: '/profile/:username',
  lazy: async () => {
    const [{ ProfilePage: Component }, { profilePageLoader: loader }] = await Promise.all([
      import('~pages/profile/profile.ui'),
      import('~pages/profile/profile.loader'),
    ]);

    return { Component, loader };
  },
  children: [
    {
      path: profilePaths.followToggle,
      middleware: [requireAuthMiddleware],
      lazy: async () => {
        const { profileFollowToggleAction: action } = await import(
          '~pages/profile/actions/profile-follow-toggle.action'
        );
        return { action };
      },
    },
    {
      path: profilePaths.favoriteToggle,
      middleware: [requireAuthMiddleware],
      lazy: async () => {
        const { articleFavoriteToggleAction: action } = await import(
          '~pages/profile/actions/article-favorite-toggle.action'
        );
        return { action };
      },
    },
  ],
} satisfies RouteObject;
