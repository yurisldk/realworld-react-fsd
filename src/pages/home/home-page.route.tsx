import { createElement } from 'react';
import { RouteObject } from 'react-router-dom';
import { PATH_PAGE } from '~shared/lib/react-router';
import { HomePage } from './home-page.ui';

export const homePageRoute: RouteObject = {
  path: PATH_PAGE.root,
  element: createElement(HomePage),
};
