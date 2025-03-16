import { RouteObject } from 'react-router-dom';
import { pathKeys } from '~shared/router';

export const homePageRoute: RouteObject = {
  path: pathKeys.home,
  lazy: async () => {
    const [loader, Component] = await Promise.all([
      import('./home-page.loader').then((module) => module.default),
      import('./home-page.ui').then((module) => module.default),
    ]);
    return { loader, Component };
  },
};
