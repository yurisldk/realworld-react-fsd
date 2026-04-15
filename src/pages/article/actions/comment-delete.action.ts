import type { ActionFunctionArgs, RouterContextProvider } from 'react-router';
import { deleteArticleComment } from '~shared/api/generated/fetch/comments/comments';
import { handleApiError } from '~shared/api/handleApiError';

export async function commentDeleteAction({ request, params }: ActionFunctionArgs<RouterContextProvider>) {
  if (!params?.slug) {
    throw new Response('Article not found', { status: 404 });
  }

  if (!params.id) {
    throw new Response('Comment id is required', { status: 400 });
  }

  const id = Number(params.id);
  if (!Number.isInteger(id) || id < 0) {
    throw new Response('Invalid comment id', { status: 400 });
  }

  const { slug } = params;

  try {
    await deleteArticleComment(slug, id, { signal: request.signal });
    return new Response(null, { status: 204 });
  } catch (error) {
    return handleApiError(error);
  }
}
