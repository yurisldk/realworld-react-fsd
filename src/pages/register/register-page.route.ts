import { createElement } from 'react';
import { RouteObject, redirect } from 'react-router-dom';
import { sessionQueries } from '~entities/session';
import { pathKeys } from '~shared/lib/react-router';
import { RegisterPage } from './register-page.ui';

export const registerPageRoute: RouteObject = {
  path: pathKeys.register(),
  element: createElement(RegisterPage),
  loader: async (args) => {
    await sessionQueries.prefetchCurrentUserQuery();
    const user = sessionQueries.getCurrentUserQueryData();
    if (user) return redirect(pathKeys.home());

    return args;
  },
};
