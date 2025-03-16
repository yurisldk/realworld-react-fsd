import { RouteObject } from 'react-router-dom';

export const articlePageRoute: RouteObject = {
  path: 'article',
  children: [
    {
      index: true,
      lazy: async () => {
        const loader = await import('./article-page.loader').then((module) => module.indexPageLoader);
        return { loader };
      },
    },
    {
      path: ':slug',
      lazy: async () => {
        const [loader, Component] = await Promise.all([
          import('./article-page.loader').then((module) => module.default),
          import('./article-page.ui').then((module) => module.default),
        ]);
        return { loader, Component };
      },
    },
  ],
};
