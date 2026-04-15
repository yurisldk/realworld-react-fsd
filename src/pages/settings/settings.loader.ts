import type { LoaderFunctionArgs, RouterContextProvider } from 'react-router';
import { userContext } from '~shared/lib/react-router/userContext';

export async function settingsPageLoader({ context }: LoaderFunctionArgs<RouterContextProvider>) {
  const userData = context.get(userContext);

  if (!userData?.user) {
    throw new Response('Unauthorized', { status: 401 });
  }

  return { userData };
}

export type SettingsPageLoaderData = Awaited<ReturnType<typeof settingsPageLoader>>;
