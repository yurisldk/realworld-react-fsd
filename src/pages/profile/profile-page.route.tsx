import { RouteObject } from 'react-router-dom';

export const profilePageRoute: RouteObject = {
  path: 'profile',
  children: [
    {
      index: true,
      lazy: async () => {
        const loader = await import('./profile-page.loader').then((module) => module.indexPageLoader);
        return { loader };
      },
    },
    {
      path: ':username',
      lazy: async () => {
        const [loader, Component] = await Promise.all([
          import('./profile-page.loader').then((module) => module.default),
          import('./profile-page.ui').then((module) => module.default),
        ]);
        return { loader, Component };
      },
    },
  ],
};
