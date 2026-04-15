import { redirect } from 'react-router';
import type { ActionFunctionArgs, RouterContextProvider } from 'react-router';
import { updateArticle } from '~shared/api/generated/fetch/articles/articles';
import { UpdateArticleBody } from '~shared/api/generated/schemas/updateArticleBody.zod';
import { handleApiError } from '~shared/api/handleApiError';
import { validateSchema } from '~shared/api/validateSchema';

function parseTags(value: FormDataEntryValue | null) {
  if (!value) {
    return undefined;
  }

  const tags = String(value)
    .split(/[\s,]+/)
    .map((tag) => tag.trim())
    .filter(Boolean);

  return tags.length > 0 ? tags : undefined;
}

export async function articleUpdateAction({ request, params }: ActionFunctionArgs<RouterContextProvider>) {
  if (!params?.slug) {
    throw new Response('Article not found', { status: 404 });
  }

  const { slug } = params;
  const formData = await request.formData();
  const fields = Object.fromEntries(formData);
  const validation = validateSchema(UpdateArticleBody, {
    article: { ...fields, tagList: parseTags(fields.tagList) },
  });

  if (!validation.ok) {
    return validation;
  }

  try {
    const apiResult = await updateArticle(slug, validation.data, { signal: request.signal });

    return redirect(`/article/${apiResult.data.article.slug}`);
  } catch (error) {
    return handleApiError(error);
  }
}

export type ArticleUpdateActionData = typeof articleUpdateAction;
