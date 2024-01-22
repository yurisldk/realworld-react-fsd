import { createElement } from 'react';
import { RouteObject } from 'react-router-dom';
import { pathKeys } from '~shared/lib/react-router';
import { HomePage } from './home-page.ui';

export const homePageRoute: RouteObject = {
  path: pathKeys.home(),
  element: createElement(HomePage),
};
