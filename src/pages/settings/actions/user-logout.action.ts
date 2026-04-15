import { redirect } from 'react-router';
import { clearToken } from '~shared/api/auth-storage';
import { getGetCurrentUserQueryKey } from '~shared/api/generated/fetch/user-and-authentication/user-and-authentication';
import { queryClient } from '~shared/api/queryClient';

export async function userLogoutAction() {
  clearToken();
  queryClient.setQueryData(getGetCurrentUserQueryKey(), null);

  return redirect('/login');
}

export type UserLogoutActionData = typeof userLogoutAction;
