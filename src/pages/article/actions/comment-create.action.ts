import type { ActionFunctionArgs, RouterContextProvider } from 'react-router';
import { createArticleComment } from '~shared/api/generated/fetch/comments/comments';
import { CreateArticleCommentBody } from '~shared/api/generated/schemas/createArticleCommentBody.zod';
import { handleApiError } from '~shared/api/handleApiError';
import { validateSchema } from '~shared/api/validateSchema';

export async function commentCreateAction({ request, params }: ActionFunctionArgs<RouterContextProvider>) {
  if (!params?.slug) {
    throw new Response('Article not found', { status: 404 });
  }

  const { slug } = params;
  const formData = await request.formData();
  const fields = Object.fromEntries(formData);
  const validation = validateSchema(CreateArticleCommentBody, { comment: fields });

  if (!validation.ok) {
    return validation;
  }

  try {
    await createArticleComment(slug, validation.data, { signal: request.signal });
    return { ok: true as const, resetKey: crypto.randomUUID() };
  } catch (error) {
    return handleApiError(error);
  }
}

export type CommentCreateActionData = typeof commentCreateAction;
