import type { LoaderFunctionArgs, RouterContextProvider } from 'react-router';
import { getGetArticleQueryOptions } from '~shared/api/generated/fetch/articles/articles';
import { getGetArticleCommentsQueryOptions } from '~shared/api/generated/fetch/comments/comments';
import { queryClient } from '~shared/api/queryClient';
import { userContext } from '~shared/lib/react-router/userContext';

export async function articlePageLoader({ request, params, context }: LoaderFunctionArgs<RouterContextProvider>) {
  if (!params.slug) {
    throw new Response('Article not found', { status: 404 });
  }

  const { slug } = params;

  const articlePromise = queryClient
    .fetchQuery(getGetArticleQueryOptions(slug, { request: { signal: request.signal } }))
    .then((response) => response.data);

  const commentsPromise = queryClient
    .fetchQuery(getGetArticleCommentsQueryOptions(slug, { request: { signal: request.signal } }))
    .then((response) => response.data);

  const userData = context.get(userContext);

  return { articlePromise, commentsPromise, userData };
}

export type ArticlePageLoaderData = Awaited<ReturnType<typeof articlePageLoader>>;
