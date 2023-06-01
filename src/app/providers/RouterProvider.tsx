import { Navigate, useRoutes } from 'react-router-dom';
import { sessionModel } from '~entities/session';
import { HomePage } from '~pages/home';
import { MainLayout } from '~pages/layouts';
import { LoginPage } from '~pages/login';
import { ProfilePage } from '~pages/profile';
import { RegisterPage } from '~pages/register';
import { SettingsPage } from '~pages/settings';
import { PATH_PAGE } from '~shared/lib/react-router';

type GuestGuardProps = {
  children: React.ReactNode;
};

function GuestGuard(props: GuestGuardProps) {
  const { children } = props;
  const isAuth = sessionModel.useAuth();

  if (!isAuth) return <Navigate to={PATH_PAGE.root} />;

  return <> {children} </>;
}

type AuthGuardProps = {
  children: React.ReactNode;
};

function AuthGuard(props: AuthGuardProps) {
  const { children } = props;
  const isAuth = sessionModel.useAuth();

  if (isAuth) return <Navigate to={PATH_PAGE.root} />;

  return <> {children} </>;
}

export function Router() {
  return useRoutes([
    {
      element: <MainLayout />,
      children: [
        { element: <HomePage />, index: true },
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
      ],
    },
    { path: '*', element: <Navigate to={PATH_PAGE.page404} replace /> },
  ]);
}
