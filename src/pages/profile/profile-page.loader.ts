import { LoaderFunctionArgs, redirect } from 'react-router-dom';
import { queryClient } from '~shared/queryClient';
import { pathKeys } from '~shared/router';
import { store } from '~shared/store';
import { articlesQueryOptions } from '~entities/article/article.api';
import { profileQueryOptions } from '~entities/profile/profile.api';
import { sessionQueryOptions } from '~entities/session/session.api';
import { SecondaryLoaderArgsSchema } from '~features/article/filter-article/filter-article.contracts';

export async function indexPageLoader() {
  return redirect(pathKeys.page404);
}

export default async function profilePageLoader(args: LoaderFunctionArgs) {
  const { searchParams } = new URL(args.request.url);
  const rawArgs = {
    ...args,
    context: {
      ...args.context,
      filterQuery: Object.fromEntries(searchParams),
    },
  };

  const { success, data: parsedArgs } = SecondaryLoaderArgsSchema.safeParse(rawArgs);

  if (!success) {
    const { username } = rawArgs.params;

    if (!username) {
      return redirect(pathKeys.page404);
    }

    const redirectUrl = new URL(args.request.url);
    redirectUrl.search = new URLSearchParams({
      page: '1',
      source: 'global',
      author: username,
    }).toString();

    return redirect(redirectUrl.href);
  }

  const { params, context } = parsedArgs;
  const { username } = params;
  const { filterQuery } = context;

  queryClient.prefetchQuery(profileQueryOptions(username));
  queryClient.prefetchQuery(articlesQueryOptions(filterQuery));

  if (store.getState()?.session?.token) {
    queryClient.prefetchQuery(sessionQueryOptions);
  }

  return parsedArgs;
}
