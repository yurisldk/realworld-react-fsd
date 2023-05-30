import { Navigate, useRoutes } from 'react-router-dom';
import { sessionModel } from '~entities/session';
import { HomePage } from '~pages/home';
import { MainLayout } from '~pages/layouts';
import { LoginPage } from '~pages/login';
import { RegisterPage } from '~pages/register';
import { PATH_PAGE } from '~shared/lib/react-router';

type GuestGuardProps = {
  children: React.ReactNode;
};

function GuestGuard(props: GuestGuardProps) {
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
            <GuestGuard>
              <LoginPage />
            </GuestGuard>
          ),
        },
        {
          path: 'register',
          element: (
            <GuestGuard>
              <RegisterPage />
            </GuestGuard>
          ),
        },
      ],
    },
    { path: '*', element: <Navigate to={PATH_PAGE.page404} replace /> },
  ]);
}
