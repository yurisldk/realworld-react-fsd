import { redirect } from 'react-router';
import type { MiddlewareFunction } from 'react-router';
import { userContext } from './userContext';

export const requireAuthMiddleware: MiddlewareFunction = async ({ context }) => {
  const user = context.get(userContext);
  if (!user) {
    return redirect('/login');
  }
};
