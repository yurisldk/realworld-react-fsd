import { replace } from 'react-router';
import type { LoaderFunctionArgs, RouterContextProvider } from 'react-router';
import { getGetArticlesQueryOptions } from '~shared/api/generated/fetch/articles/articles';
import { getGetProfileByUsernameQueryOptions } from '~shared/api/generated/fetch/profile/profile';
import { queryClient } from '~shared/api/queryClient';
import { userContext } from '~shared/lib/react-router/userContext';
import { getProfileNavigation, parseProfileSearchParams, toProfileSearch } from './profile.state';

export async function profilePageLoader({ request, params, context }: LoaderFunctionArgs<RouterContextProvider>) {
  if (!params.username) {
    throw new Response('Profile not found', { status: 404 });
  }

  const { pathname, searchParams, hash } = new URL(request.url);
  const normalizedSearchParams = parseProfileSearchParams(searchParams, params.username);
  const nextSearch = toProfileSearch(normalizedSearchParams);

  if (`?${searchParams.toString()}` !== nextSearch) {
    throw replace(`${pathname}${nextSearch}${hash}`);
  }

  const userData = context.get(userContext);

  const navigation = getProfileNavigation(normalizedSearchParams);
  const profilePromise = queryClient
    .fetchQuery(getGetProfileByUsernameQueryOptions(params.username, { request: { signal: request.signal } }))
    .then((response) => response.data);

  const articlesPromise = queryClient
    .fetchQuery(getGetArticlesQueryOptions(normalizedSearchParams, { request: { signal: request.signal } }))
    .then((response) => response.data);

  return {
    profilePromise,
    articlesPromise,
    userData,
    searchParams: normalizedSearchParams,
    navigation,
  };
}

export type ProfilePageLoaderData = Awaited<ReturnType<typeof profilePageLoader>>;
