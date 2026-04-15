import type { RouteObject } from 'react-router';
import { requireAuthMiddleware } from '~shared/lib/react-router/requireAuthMiddleware';
import { settingsPaths } from './settings.paths';

export const settingsRoute = {
  path: '/settings',
  middleware: [requireAuthMiddleware],
  lazy: async () => {
    const [{ SettingsPage: Component }, { settingsPageLoader: loader }] = await Promise.all([
      import('~pages/settings/settings.ui'),
      import('~pages/settings/settings.loader'),
    ]);

    return { Component, loader };
  },
  children: [
    {
      path: settingsPaths.update,
      lazy: async () => {
        const { userUpdateAction: action } = await import('~pages/settings/actions/user-update.action');
        return { action };
      },
    },
    {
      path: settingsPaths.logout,
      lazy: async () => {
        const { userLogoutAction: action } = await import('~pages/settings/actions/user-logout.action');
        return { action };
      },
    },
  ],
} satisfies RouteObject;
