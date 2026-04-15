import type { ActionFunctionArgs, RouterContextProvider } from 'react-router';
import { createArticleFavorite, deleteArticleFavorite } from '~shared/api/generated/fetch/favorites/favorites';
import { handleApiError } from '~shared/api/handleApiError';

export async function articleFavoriteToggleAction({ request, params }: ActionFunctionArgs<RouterContextProvider>) {
  if (!params?.slug) {
    throw new Response('Article not found', { status: 404 });
  }

  const { slug } = params;
  const formData = await request.formData();
  const operation = formData.get('operation');

  try {
    if (operation === 'unfavorite') {
      await deleteArticleFavorite(slug, { signal: request.signal });
      return new Response(null, { status: 204 });
    }

    if (operation === 'favorite') {
      await createArticleFavorite(slug, { signal: request.signal });
      return new Response(null, { status: 204 });
    }

    return new Response('Invalid operation', { status: 400 });
  } catch (error) {
    return handleApiError(error);
  }
}
