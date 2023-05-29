import { Navigate, useRoutes } from 'react-router-dom';
import { useStore } from 'zustand';
import { sessionModel } from '~entities/session';
import { HomePage } from '~pages/home';
import { MainLayout } from '~pages/layouts';
import { LoginPage } from '~pages/login';
import { RegisterPage } from '~pages/register';

type GuestGuardProps = {
  children: React.ReactNode;
};

function GuestGuard(props: GuestGuardProps) {
  const { children } = props;
  const token = useStore(sessionModel.sessionStore, (state) => state.token);

  if (token) return <Navigate to="/" />;

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
    { path: '*', element: <Navigate to="/404" replace /> },
  ]);
}
