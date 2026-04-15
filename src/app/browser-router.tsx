import { Link, createBrowserRouter, isRouteErrorResponse, redirect, useRouteError } from 'react-router';
import { getErrorMessage } from '~shared/lib/react-router/getErrorMessage';
import { loadUserMiddleware } from '~shared/lib/react-router/loadUserMiddleware';
import { Spinner } from '~shared/ui/spinner/spinner.ui';
import { articleRoute } from '~pages/article/article.route';
import { editorRoute } from '~pages/editor/editor.route';
import { homeRoute } from '~pages/home/home.route';
import { loginRoute } from '~pages/login/login.route';
import { page404Route } from '~pages/page-404/page-404.route';
import { profileRoute } from '~pages/profile/profile.route';
import { registerRoute } from '~pages/register/register.route';
import { settingsRoute } from '~pages/settings/settings.route';
import { Layout } from './app-layout.ui';
import { appLoader } from './app.loader';

export const browserRouter = () =>
  createBrowserRouter([
    {
      id: 'root',
      middleware: [loadUserMiddleware],
      Component: Layout,
      loader: appLoader,
      ErrorBoundary: RootErrorBoundary,
      children: [loginRoute, registerRoute, settingsRoute, homeRoute, profileRoute, articleRoute, editorRoute],
      hydrateFallbackElement: <Spinner />,
    },
    page404Route,
    {
      path: '*',
      loader: async () => redirect('/404'),
    },
  ]);

function RootErrorBoundary() {
  const error = useRouteError();
  const isUnauthorized = isRouteErrorResponse(error) && error.status === 401;

  return (
    <div className="container page">
      <div className="row">
        <div className="col-md-12">
          <div className="card">
            <div className="card-block">
              <p className="card-text">
                <strong>{isUnauthorized ? 'Authentication expired' : 'Page unavailable'}</strong>
              </p>
              <p className="card-text">
                {getErrorMessage(
                  error,
                  isUnauthorized ? 'Your token is invalid or expired. Please log in again.' : 'Something went wrong.',
                )}
              </p>
              {isUnauthorized && (
                <p className="card-text">
                  <Link to="/login" replace>
                    Go to login
                  </Link>
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
