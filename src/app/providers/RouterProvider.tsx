import { ElementType, ReactNode, Suspense, lazy } from 'react';
import { Navigate, useRoutes } from 'react-router-dom';
import { sessionModel } from '~entities/session';
import { MainLayout } from '~pages/layouts';
import { PATH_PAGE } from '~shared/lib/react-router';
import { FullPageWrapper } from '~shared/ui/full-page-wrapper';
import { Spinner } from '~shared/ui/spinner';

const Loadable = (Component: ElementType) =>
  function fn(props: any) {
    return (
      <Suspense
        fallback={
          <FullPageWrapper>
            <Spinner />
          </FullPageWrapper>
        }
      >
        <Component {...props} />
      </Suspense>
    );
  };

function GuestGuard(props: { children: ReactNode }) {
  const { children } = props;
  const isAuth = sessionModel.useAuth();

  if (!isAuth) return <Navigate to={PATH_PAGE.root} />;

  return <> {children} </>;
}

function AuthGuard(props: { children: ReactNode }) {
  const { children } = props;
  const isAuth = sessionModel.useAuth();

  if (isAuth) return <Navigate to={PATH_PAGE.root} />;

  return <> {children} </>;
}

const ArticlePage = Loadable(lazy(() => import('~pages/article')));
const EditorPage = Loadable(lazy(() => import('~pages/editor')));
const HomePage = Loadable(lazy(() => import('~pages/home')));
const LoginPage = Loadable(lazy(() => import('~pages/login')));
const Page404 = Loadable(lazy(() => import('~pages/page-404')));
const ProfilePage = Loadable(lazy(() => import('~pages/profile')));
const RegisterPage = Loadable(lazy(() => import('~pages/register')));
const SettingsPage = Loadable(lazy(() => import('~pages/settings')));

export function Router() {
  const isAuth = sessionModel.useAuth();

  return useRoutes([
    {
      element: <MainLayout />,
      children: [
        {
          path: PATH_PAGE.root,
          element: isAuth ? <HomePage auth /> : <HomePage />,
        },
        {
          path: 'login',
          element: (
            <AuthGuard>
              <LoginPage />,
            </AuthGuard>
          ),
        },
        {
          path: 'register',
          element: (
            <AuthGuard>
              <RegisterPage />,
            </AuthGuard>
          ),
        },
        {
          path: 'settings',
          element: (
            <GuestGuard>
              <SettingsPage />
            </GuestGuard>
          ),
        },
        {
          path: 'editor',
          children: [
            {
              element: (
                <GuestGuard>
                  <EditorPage />
                </GuestGuard>
              ),
              index: true,
            },
            {
              path: ':slug',
              element: (
                <GuestGuard>
                  <EditorPage edit />
                </GuestGuard>
              ),
            },
          ],
        },
        {
          path: 'profile',
          children: [
            {
              element: <Navigate to={PATH_PAGE.page404} replace />,
              index: true,
            },
            { path: ':username', element: <ProfilePage /> },
            { path: ':username/favorites', element: <ProfilePage favorites /> },
          ],
        },
        {
          path: 'article',
          children: [
            {
              element: <Navigate to={PATH_PAGE.page404} replace />,
              index: true,
            },
            { path: ':slug', element: <ArticlePage /> },
          ],
        },
      ],
    },
    { path: '404', element: <Page404 /> },
    { path: '*', element: <Navigate to={PATH_PAGE.page404} replace /> },
  ]);
}
