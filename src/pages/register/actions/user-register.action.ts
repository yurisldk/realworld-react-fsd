import { redirect } from 'react-router';
import type { ActionFunctionArgs, RouterContextProvider } from 'react-router';
import { setToken } from '~shared/api/auth-storage';
import {
  createUser,
  getGetCurrentUserQueryKey,
} from '~shared/api/generated/fetch/user-and-authentication/user-and-authentication';
import { CreateUserBody } from '~shared/api/generated/schemas/createUserBody.zod';
import { handleApiError } from '~shared/api/handleApiError';
import { queryClient } from '~shared/api/queryClient';
import { validateSchema } from '~shared/api/validateSchema';

export async function userRegisterAction({ request }: ActionFunctionArgs<RouterContextProvider>) {
  const formData = await request.formData();
  const validation = validateSchema(CreateUserBody, { user: Object.fromEntries(formData) });

  if (!validation.ok) {
    return validation;
  }

  try {
    const response = await createUser(validation.data, { signal: request.signal });
    setToken(response.data.user.token);
    queryClient.setQueryData(getGetCurrentUserQueryKey(), response);
    return redirect('/settings');
  } catch (error) {
    return handleApiError(error);
  }
}

export type UserRegisterActionData = typeof userRegisterAction;
