import { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { PATH_PAGE } from '~shared/lib/react-router';
import { useAuth } from '../../session.model';

type AuthGuardProps = { children: ReactNode };

export function AuthGuard(props: AuthGuardProps) {
  const { children } = props;
  const isAuth = useAuth();

  if (isAuth) return <Navigate to={PATH_PAGE.root} />;

  return <> {children} </>;
}
