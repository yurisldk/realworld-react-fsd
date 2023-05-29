import { Navigate, useRoutes } from 'react-router-dom';
import { HomePage } from '~pages/home';
import { MainLayout } from '~pages/layouts';

export function Router() {
  return useRoutes([
    {
      element: <MainLayout />,
      children: [{ element: <HomePage />, index: true }],
    },
    { path: '*', element: <Navigate to="/404" replace /> },
  ]);
}
