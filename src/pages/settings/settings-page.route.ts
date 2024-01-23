import { createElement } from 'react';
import { RouteObject, redirect } from 'react-router-dom';
import { sessionModel, sessionQueries } from '~entities/session';
import { pathKeys } from '~shared/lib/react-router';
import { SettingsPage } from './settings-page.ui';

export const settingsPageRoute: RouteObject = {
  path: pathKeys.settings(),
  element: createElement(SettingsPage),
  loader: async (args) => {
    if (!sessionModel.hasToken()) {
      return redirect(pathKeys.login());
    }

    sessionQueries.userService.prefetchQuery();
    return args;
  },
};
