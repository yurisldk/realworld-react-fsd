import { RouteObject } from 'react-router-dom';
import { pathKeys } from '~shared/router';

export const registerPageRoute: RouteObject = {
  path: pathKeys.register,
  lazy: async () => {
    const [loader, Component] = await Promise.all([
      import('./register-page.loader').then((module) => module.default),
      import('./register-page.ui').then((module) => module.default),
    ]);
    return { loader, Component };
  },
};
