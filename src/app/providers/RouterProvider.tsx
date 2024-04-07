import {
  RouterProvider,
  createBrowserRouter,
  redirect,
  useRouteError,
} from 'react-router-dom';
import { articlePageRoute } from '~pages/article';
import { editorPageRoute } from '~pages/editor';
import { homePageRoute } from '~pages/home';
import { GuestLayout, NakedLayout, GenericLayout } from '~pages/layouts';
import { loginPageRoute } from '~pages/login';
import { page404Route } from '~pages/page-404';
import { profilePageRoute } from '~pages/profile';
import { registerPageRoute } from '~pages/register';
import { settingsPageRoute } from '~pages/settings';
import { pathKeys } from '~shared/lib/react-router';

// https://github.com/remix-run/react-router/discussions/10166
function BubbleError() {
  const error = useRouteError();
  if (error) throw error;
  return null;
}

export function BrowserRouter() {
  return (
    <RouterProvider
      router={createBrowserRouter([
        {
          errorElement: <BubbleError />,
          children: [
            {
              element: <GenericLayout />,
              children: [
                editorPageRoute,
                settingsPageRoute,
                homePageRoute,
                articlePageRoute,
                profilePageRoute,
              ],
            },
            {
              element: <GuestLayout />,
              children: [loginPageRoute, registerPageRoute],
            },
            {
              element: <NakedLayout />,
              children: [page404Route],
            },
            {
              loader: async () => redirect(pathKeys.page404()),
              path: '*',
            },
          ],
        },
      ])}
    />
  );
}
