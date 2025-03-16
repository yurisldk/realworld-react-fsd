import { RouteObject } from 'react-router-dom';
import { pathKeys } from '~shared/router';

export const settingsPageRoute: RouteObject = {
  path: pathKeys.settings,
  lazy: async () => {
    const [loader, Component] = await Promise.all([
      import('./settings-page.loader').then((module) => module.default),
      import('./settings-page.ui').then((module) => module.default),
    ]);
    return { loader, Component };
  },
};
