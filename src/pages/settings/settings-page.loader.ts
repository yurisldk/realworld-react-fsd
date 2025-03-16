import { LoaderFunctionArgs, redirect } from 'react-router-dom';
import { queryClient } from '~shared/queryClient';
import { pathKeys } from '~shared/router';
import { store } from '~shared/store';
import { sessionQueryOptions } from '~entities/session/session.api';

export default async function settingsPageLoader(args: LoaderFunctionArgs) {
  if (store.getState().session?.token) {
    queryClient.prefetchQuery(sessionQueryOptions);
    return args;
  }
  return redirect(pathKeys.login);
}
