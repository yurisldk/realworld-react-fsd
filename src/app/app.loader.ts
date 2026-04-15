import type { LoaderFunctionArgs, RouterContextProvider } from 'react-router';
import { userContext } from '~shared/lib/react-router/userContext';

export async function appLoader({ context }: LoaderFunctionArgs<RouterContextProvider>) {
  return { userData: context.get(userContext) };
}

export type AppLoaderData = Awaited<ReturnType<typeof appLoader>>;
