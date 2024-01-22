import { createElement } from 'react';
import { RouteObject, redirect } from 'react-router-dom';
import { sessionQueries } from '~entities/session';
import { pathKeys } from '~shared/lib/react-router';
import { LoginPage } from './login-page.ui';

export const loginPageRoute: RouteObject = {
  path: pathKeys.login(),
  element: createElement(LoginPage),
  loader: async (args) => {
    await sessionQueries.prefetchCurrentUserQuery();
    const user = sessionQueries.getCurrentUserQueryData();
    if (user) return redirect(pathKeys.home());

    return args;
  },
};
