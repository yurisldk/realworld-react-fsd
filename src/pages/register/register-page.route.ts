import { createElement } from 'react';
import { RouteObject } from 'react-router-dom';
import { PATH_PAGE } from '~shared/lib/react-router';
import { RegisterPage } from './register-page.ui';

export const registerPageRoute: RouteObject = {
  path: PATH_PAGE.register,
  element: createElement(RegisterPage),
  loader: async () => {
    // TODO: auth guard
    return null;
  },
};
