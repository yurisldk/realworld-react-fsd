import type { ActionFunctionArgs, RouterContextProvider } from 'react-router';
import * as zod from 'zod/mini';
import { followUserByUsername, unfollowUserByUsername } from '~shared/api/generated/fetch/profile/profile';
import { handleApiError } from '~shared/api/handleApiError';

export async function profileFollowToggleAction({ request }: ActionFunctionArgs<RouterContextProvider>) {
  const formData = await request.formData();
  const operation = formData.get('operation');
  const validatedUsername = zod.string().check(zod.trim(), zod.minLength(1)).safeParse(formData.get('username'));

  if (!validatedUsername.success) {
    return new Response('Profile not found', { status: 404 });
  }

  try {
    if (operation === 'unfollow') {
      await unfollowUserByUsername(validatedUsername.data, { signal: request.signal });
      return new Response(null, { status: 204 });
    }

    if (operation === 'follow') {
      await followUserByUsername(validatedUsername.data, { signal: request.signal });
      return new Response(null, { status: 204 });
    }

    return new Response('Invalid operation', { status: 400 });
  } catch (error) {
    return handleApiError(error);
  }
}
