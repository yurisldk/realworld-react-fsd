import { createElement } from 'react';
import { RouteObject } from 'react-router-dom';
import { PATH_PAGE } from '~shared/lib/react-router';
import { SettingsPage } from './settings-page.ui';

export const settingsPageRoute: RouteObject = {
  path: PATH_PAGE.settings,
  element: createElement(SettingsPage),
};
