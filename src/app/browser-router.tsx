import { Outlet, createBrowserRouter, redirect, useRouteError } from 'react-router-dom';
import { pathKeys } from '~shared/router';
import { articlePageRoute } from '~pages/article/article-page.route';
import { editorPageRoute } from '~pages/editor/editor-page.route';
import { homePageRoute } from '~pages/home/home-page.route';
import { lazyLayout } from '~pages/layout/layout.route';
import { loginPageRoute } from '~pages/login/login-page.route';
import { page404Route } from '~pages/page-404/page-404.route';
import { profilePageRoute } from '~pages/profile/profile-page.route';
import { registerPageRoute } from '~pages/register/register-page.route';
import { settingsPageRoute } from '~pages/settings/settings-page.route';

export const browserRouter = createBrowserRouter([
  {
    errorElement: <BubbleError />,
    children: [
      {
        lazy: lazyLayout,
        children: [
          loginPageRoute,
          registerPageRoute,
          homePageRoute,
          articlePageRoute,
          profilePageRoute,
          editorPageRoute,
          settingsPageRoute,
        ],
      },
      {
        element: <Outlet />,
        children: [page404Route],
      },
      {
        path: '*',
        loader: async () => redirect(pathKeys.page404),
      },
    ],
  },
]);

// https://github.com/remix-run/react-router/discussions/10166
function BubbleError(): null {
  const error = useRouteError();

  if (error) throw error;
  return null;
}
