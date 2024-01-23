import { createElement } from 'react';
import { RouteObject, redirect } from 'react-router-dom';
import { sessionModel, sessionQueries } from '~entities/session';
import { pathKeys } from '~shared/lib/react-router';
import { RegisterPage } from './register-page.ui';

export const registerPageRoute: RouteObject = {
  path: pathKeys.register(),
  element: createElement(RegisterPage),
  loader: async (args) => {
    if (sessionModel.hasToken()) {
      return redirect(pathKeys.home());
    }

    sessionQueries.userService.prefetchQuery();
    return args;
  },
};
