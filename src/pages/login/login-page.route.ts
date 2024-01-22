import { createElement } from 'react';
import { RouteObject } from 'react-router-dom';
import { PATH_PAGE } from '~shared/lib/react-router';
import { LoginPage } from './login-page.ui';

export const loginPageRoute: RouteObject = {
  path: PATH_PAGE.login,
  element: createElement(LoginPage),
  loader: async () => {
    // TODO: auth guard
    return null;
  },
};
