import { redirect } from 'react-router';
import type { ActionFunctionArgs, RouterContextProvider } from 'react-router';
import { deleteArticle } from '~shared/api/generated/fetch/articles/articles';
import { handleApiError } from '~shared/api/handleApiError';

export async function articleDeleteAction({ request, params }: ActionFunctionArgs<RouterContextProvider>) {
  if (!params?.slug) {
    throw new Response('Article not found', { status: 404 });
  }

  const { slug } = params;

  try {
    await deleteArticle(slug, { signal: request.signal });
    return redirect('/');
  } catch (error) {
    return handleApiError(error);
  }
}
