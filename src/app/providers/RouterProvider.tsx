import { Navigate, useRoutes } from 'react-router-dom';
import { MainLayout } from '~pages/layouts';
import { HomePage } from '~pages/main';

export function Router() {
  return useRoutes([
    {
      element: <MainLayout />,
      children: [{ element: <HomePage />, index: true }],
    },
    { path: '*', element: <Navigate to="/404" replace /> },
  ]);
}
