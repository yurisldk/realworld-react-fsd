import { LazyRouteFunction, RouteObject } from 'react-router-dom';

export const lazyLayout: LazyRouteFunction<RouteObject> = async () => {
  const [loader, Component] = await Promise.all([
    import('./layout.loader').then((module) => module.default),
    import('./layout.ui').then((module) => module.default),
  ]);
  return { loader, Component };
};
