import { createElement } from 'react';
import { RouteObject, redirect } from 'react-router-dom';
import { sessionQueries } from '~entities/session';
import { pathKeys } from '~shared/lib/react-router';
import { SettingsPage } from './settings-page.ui';

export const settingsPageRoute: RouteObject = {
  path: pathKeys.settings(),
  element: createElement(SettingsPage),
  loader: async (args) => {
    await sessionQueries.prefetchCurrentUserQuery();
    const user = sessionQueries.getCurrentUserQueryData();
    if (!user) return redirect(pathKeys.login());

    return args;
  },
};
