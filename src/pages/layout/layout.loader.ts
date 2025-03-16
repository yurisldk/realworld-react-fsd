import { LoaderFunctionArgs } from 'react-router-dom';
import { queryClient } from '~shared/queryClient';
import { store } from '~shared/store';
import { sessionQueryOptions } from '~entities/session/session.api';

export default async function appLoader(args: LoaderFunctionArgs) {
  if (store.getState()?.session?.token) {
    queryClient.prefetchQuery(sessionQueryOptions);
  }

  return args;
}
