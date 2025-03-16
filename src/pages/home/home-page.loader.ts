import { LoaderFunctionArgs, redirect } from 'react-router-dom';
import { queryClient } from '~shared/queryClient';
import { store } from '~shared/store';
import { articlesQueryOptions } from '~entities/article/article.api';
import { sessionQueryOptions } from '~entities/session/session.api';
import { tagsQueryOptions } from '~entities/tag/tag.api';
import { PrimaryLoaderArgsSchema } from '~features/article/filter-article/filter-article.contracts';

export default async function homePageLoader(args: LoaderFunctionArgs) {
  const { searchParams } = new URL(args.request.url);
  const rawArgs = {
    ...args,
    context: {
      ...args.context,
      filterQuery: Object.fromEntries(searchParams),
    },
  };

  const { success, data: parsedArgs } = PrimaryLoaderArgsSchema.safeParse(rawArgs);

  if (!success) {
    const redirectUrl = new URL(args.request.url);
    redirectUrl.search = new URLSearchParams({
      page: '1',
      source: 'global',
    }).toString();

    return redirect(redirectUrl.href);
  }

  const { context } = parsedArgs;
  const { filterQuery } = context;

  queryClient.prefetchQuery(tagsQueryOptions);
  queryClient.prefetchQuery(articlesQueryOptions(filterQuery));

  if (store.getState()?.session?.token) {
    queryClient.prefetchQuery(sessionQueryOptions);
  }

  return parsedArgs;
}
