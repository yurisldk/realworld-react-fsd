import { createElement } from 'react';
import { RouteObject } from 'react-router-dom';
import { pathKeys } from '~shared/lib/react-router';
import { Page404 } from './page-404.ui';

export const page404Route: RouteObject = {
  path: pathKeys.page404(),
  element: createElement(Page404),
};
