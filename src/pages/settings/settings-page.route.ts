import { createElement } from 'react';
import { RouteObject } from 'react-router-dom';
import { pathKeys } from '~shared/lib/react-router';
import { SettingsPage } from './settings-page.ui';

export const settingsPageRoute: RouteObject = {
  path: pathKeys.settings(),
  element: createElement(SettingsPage),
};
