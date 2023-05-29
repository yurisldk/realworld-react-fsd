import { Navigate, useRoutes } from 'react-router-dom';
import { HomePage } from '~pages/home';
import { MainLayout } from '~pages/layouts';
import { LoginPage } from '~pages/login';
import { RegisterPage } from '~pages/register';

export function Router() {
  return useRoutes([
    {
      element: <MainLayout />,
      children: [
        { element: <HomePage />, index: true },
        { path: 'login', element: <LoginPage /> },
        { path: 'register', element: <RegisterPage /> },
      ],
    },
    { path: '*', element: <Navigate to="/404" replace /> },
  ]);
}
