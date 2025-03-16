import { RouteObject } from 'react-router-dom';
import { pathKeys } from '~shared/router';

export const loginPageRoute: RouteObject = {
  path: pathKeys.login,
  lazy: async () => {
    const [loader, Component] = await Promise.all([
      import('./login-page.loader').then((module) => module.default),
      import('./login-page.ui').then((module) => module.default),
    ]);
    return { loader, Component };
  },
};
