import { LoaderFunctionArgs, redirect } from 'react-router-dom';
import { z } from 'zod';
import { queryClient } from '~shared/queryClient';
import { pathKeys } from '~shared/router';
import { store } from '~shared/store';
import { articleQueryOptions } from '~entities/article/article.api';
import { commentsQueryOptions } from '~entities/comment/comment.api';
import { sessionQueryOptions } from '~entities/session/session.api';

export async function indexPageLoader() {
  return redirect(pathKeys.page404);
}

export default async function articlePageLoader(args: LoaderFunctionArgs) {
  const parsedArgs = ArticleLoaderArgsSchema.parse(args);
  const { params } = parsedArgs;
  const { slug } = params;

  queryClient.prefetchQuery(articleQueryOptions(slug));
  queryClient.prefetchQuery(commentsQueryOptions(slug));

  if (store.getState()?.session?.token) {
    queryClient.prefetchQuery(sessionQueryOptions);
  }

  return parsedArgs;
}

const ArticleLoaderArgsSchema = z.object({
  request: z.custom<Request>(),
  params: z.object({ slug: z.string() }),
  context: z.any(),
});

export type ArticleLoaderArgs = z.infer<typeof ArticleLoaderArgsSchema>;
