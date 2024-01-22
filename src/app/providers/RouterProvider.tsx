import {
  RouterProvider,
  createBrowserRouter,
  redirect,
  useRouteError,
} from 'react-router-dom';
import { articlePageRoute } from '~pages/article';
import { editorPageRoute } from '~pages/editor';
import { homePageRoute } from '~pages/home';
import { MainLayout } from '~pages/layouts';
import { loginPageRoute } from '~pages/login';
import { page404Route } from '~pages/page-404';
import { profilePageRoute } from '~pages/profile';
import { registerPageRoute } from '~pages/register';
import { settingsPageRoute } from '~pages/settings';
import { PATH_PAGE } from '~shared/lib/react-router';

// https://github.com/remix-run/react-router/discussions/10166
const BubbleError = () => {
  const error = useRouteError();
  throw error;
};

const router = createBrowserRouter([
  {
    element: <MainLayout />,
    errorElement: <BubbleError />,
    children: [
      articlePageRoute,
      editorPageRoute,
      homePageRoute,
      loginPageRoute,
      profilePageRoute,
      registerPageRoute,
      settingsPageRoute,
    ],
  },
  page404Route,
  { path: '*', loader: async () => redirect(PATH_PAGE.page404) },
]);

export function BrowserRouter() {
  return <RouterProvider router={router} />;
}
