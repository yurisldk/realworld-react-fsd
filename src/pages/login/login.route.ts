import type { RouteObject } from 'react-router';
import { redirectIfAuthenticatedMiddleware } from '~shared/lib/react-router/redirectIfAuthenticatedMiddleware';

export const loginRoute = {
  path: '/login',
  middleware: [redirectIfAuthenticatedMiddleware],
  lazy: async () => {
    const [{ LoginPage: Component }, { userLoginAction: action }] = await Promise.all([
      import('~pages/login/login.ui'),
      import('~pages/login/actions/user-login.action'),
    ]);

    return { Component, action };
  },
} satisfies RouteObject;
