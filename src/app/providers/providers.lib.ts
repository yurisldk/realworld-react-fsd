import { useRouteError, LoaderFunctionArgs, redirect } from 'react-router-dom';
import { sessionModel, sessionQueries, sessionApi } from '~entities/session';
import { queryClient } from '~shared/lib/react-query';
import { pathKeys } from '~shared/lib/react-router';

// https://github.com/remix-run/react-router/discussions/10166
export function BubbleError() {
  const error = useRouteError();
  if (error) throw error;
  return null;
}

export async function userLoader(args: LoaderFunctionArgs) {
  if (!sessionModel.hasToken()) return redirect(pathKeys.login());
  const user = await currentUserQuery();
  return { ...args, user };
}

export function guestLoader(args: LoaderFunctionArgs) {
  if (sessionModel.hasToken()) return redirect(pathKeys.home());
  return args;
}

export function unknownLoader() {
  return redirect(pathKeys.page404());
}

const currentUserQuery = async () =>
  queryClient.ensureQueryData({
    queryKey: sessionQueries.sessionKeys.currentUser(),
    queryFn: sessionApi.currentUserQuery,
  });
