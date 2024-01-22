import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import { articlePageRoute } from '~pages/article';
import { editorPageRoute } from '~pages/editor';
import { homePageRoute } from '~pages/home';
import { GuestLayout, NakedLayout, UserLayout } from '~pages/layouts';
import { loginPageRoute } from '~pages/login';
import { page404Route } from '~pages/page-404';
import { profilePageRoute } from '~pages/profile';
import { registerPageRoute } from '~pages/register';
import { settingsPageRoute } from '~pages/settings';
import {
  BubbleError,
  commonLoader,
  guestLoader,
  unknownLoader,
  userLoader,
} from './providers.lib';

const router = createBrowserRouter([
  {
    errorElement: <BubbleError />,
    children: [
      {
        loader: userLoader,
        element: <UserLayout />,
        children: [editorPageRoute, settingsPageRoute],
      },
      {
        loader: commonLoader,
        element: <UserLayout />,
        children: [homePageRoute, articlePageRoute, profilePageRoute],
      },
      {
        loader: guestLoader,
        element: <GuestLayout />,
        children: [loginPageRoute, registerPageRoute],
      },
      {
        element: <NakedLayout />,
        children: [page404Route],
      },
    ],
  },
  {
    loader: unknownLoader,
    path: '*',
  },
]);

export function BrowserRouter() {
  return <RouterProvider router={router} />;
}
