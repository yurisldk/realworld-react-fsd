import { replace } from 'react-router';
import type { LoaderFunctionArgs, RouterContextProvider } from 'react-router';
import {
  getGetArticlesFeedQueryOptions,
  getGetArticlesQueryOptions,
} from '~shared/api/generated/fetch/articles/articles';
import { getGetTagsQueryOptions } from '~shared/api/generated/fetch/tags/tags';
import { queryClient } from '~shared/api/queryClient';
import { userContext } from '~shared/lib/react-router/userContext';
import { getHomeNavigation, parseHomeSearchParams, toHomeSearch } from './home.state';

export async function homePageLoader({ request, context }: LoaderFunctionArgs<RouterContextProvider>) {
  const { pathname, searchParams, hash } = new URL(request.url);
  const parsedSearchParams = parseHomeSearchParams(searchParams);

  const userData = context.get(userContext);

  const normalizedSearchParams =
    !userData && parsedSearchParams.feed === 'personal'
      ? { ...parsedSearchParams, feed: undefined }
      : parsedSearchParams;

  const nextSearch = toHomeSearch(normalizedSearchParams);
  if (`?${searchParams.toString()}` !== nextSearch) {
    throw replace(`${pathname}${nextSearch}${hash}`);
  }

  const navigation = getHomeNavigation(normalizedSearchParams);

  const tagsPromise = queryClient
    .fetchQuery(getGetTagsQueryOptions({ request: { signal: request.signal } }))
    .then((response) => response.data);

  let articlesPromise;
  if (normalizedSearchParams.feed === 'personal') {
    articlesPromise = queryClient
      .fetchQuery(
        getGetArticlesFeedQueryOptions(
          { limit: normalizedSearchParams.limit, offset: normalizedSearchParams.offset },
          { request: { signal: request.signal } },
        ),
      )
      .then((response) => response.data);
  } else {
    articlesPromise = queryClient
      .fetchQuery(getGetArticlesQueryOptions(normalizedSearchParams, { request: { signal: request.signal } }))
      .then((response) => response.data);
  }

  return { articlesPromise, tagsPromise, userData, searchParams: normalizedSearchParams, navigation };
}

export type HomePageLoaderData = Awaited<ReturnType<typeof homePageLoader>>;
