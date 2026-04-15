import type { LoaderFunctionArgs, RouterContextProvider } from 'react-router';
import { getGetArticleQueryOptions } from '~shared/api/generated/fetch/articles/articles';
import { queryClient } from '~shared/api/queryClient';

export async function editorPageLoader({ request, params }: LoaderFunctionArgs<RouterContextProvider>) {
  if (!params?.slug) {
    throw new Response('Article not found', { status: 404 });
  }

  const { slug } = params;

  const articlePromise = queryClient
    .fetchQuery(getGetArticleQueryOptions(slug, { request: { signal: request.signal } }))
    .then((response) => response.data);

  return { articlePromise };
}

export type EditorPageLoaderData = Awaited<ReturnType<typeof editorPageLoader>>;
