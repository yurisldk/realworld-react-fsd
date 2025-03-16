import { RouteObject } from 'react-router-dom';
import { pathKeys } from '~shared/router';

export const page404Route: RouteObject = {
  path: pathKeys.page404,
  lazy: async () => {
    const Component = await import('./page-404.ui').then((module) => module.default);
    return { Component };
  },
};
