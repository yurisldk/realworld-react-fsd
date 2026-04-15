import type { RouteObject } from 'react-router';
import { redirectIfAuthenticatedMiddleware } from '~shared/lib/react-router/redirectIfAuthenticatedMiddleware';

export const registerRoute = {
  path: '/register',
  middleware: [redirectIfAuthenticatedMiddleware],
  lazy: async () => {
    const [{ RegisterPage: Component }, { userRegisterAction: action }] = await Promise.all([
      import('~pages/register/register.ui'),
      import('~pages/register/actions/user-register.action'),
    ]);

    return { Component, action };
  },
} satisfies RouteObject;
