import { redirect } from 'react-router';
import type { ActionFunctionArgs, RouterContextProvider } from 'react-router';
import { setToken } from '~shared/api/auth-storage';
import {
  getGetCurrentUserQueryKey,
  updateCurrentUser,
} from '~shared/api/generated/fetch/user-and-authentication/user-and-authentication';
import { UpdateCurrentUserBody } from '~shared/api/generated/schemas/updateCurrentUserBody.zod';
import { handleApiError } from '~shared/api/handleApiError';
import { queryClient } from '~shared/api/queryClient';
import { validateSchema } from '~shared/api/validateSchema';

export async function userUpdateAction({ request }: ActionFunctionArgs<RouterContextProvider>) {
  const formData = await request.formData();
  const validation = validateSchema(UpdateCurrentUserBody, { user: Object.fromEntries(formData) });

  if (!validation.ok) {
    return validation;
  }

  try {
    const response = await updateCurrentUser(validation.data, { signal: request.signal });
    setToken(response.data.user.token);
    queryClient.setQueryData(getGetCurrentUserQueryKey(), response);
    return redirect('/settings');
  } catch (error) {
    return handleApiError(error);
  }
}

export type UserUpdateActionData = typeof userUpdateAction;
