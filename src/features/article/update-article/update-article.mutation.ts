import { DefaultError, useMutation, UseMutationOptions } from '@tanstack/react-query';
import { updateArticle } from '~shared/api/api.service';
import { queryClient } from '~shared/queryClient';
import { ARTICLES_ROOT_QUERY_KEY } from '~entities/article/article.api';
import { transformArticleDtoToArticle } from '~entities/article/article.lib';
import { Article } from '~entities/article/article.types';
import { transformUpdateArticleToUpdateArticleDto } from './update-article.lib';
import { UpdateArticle } from './update-article.types';

export function useUpdateArticleMutation(
  options: Pick<
    UseMutationOptions<Article, DefaultError, UpdateArticle, unknown>,
    'mutationKey' | 'onMutate' | 'onSuccess' | 'onError' | 'onSettled'
  > = {},
) {
  const { mutationKey = [], onMutate, onSuccess, onError, onSettled } = options;

  return useMutation({
    mutationKey: ['article', 'update', ...mutationKey],

    mutationFn: async (updateArticleData: UpdateArticle) => {
      const { slug } = updateArticleData;
      const updateArticleDto = transformUpdateArticleToUpdateArticleDto(updateArticleData);
      const { data } = await updateArticle(slug, updateArticleDto);
      const article = transformArticleDtoToArticle(data);
      return article;
    },

    onMutate,

    onSuccess: async (data, variables, context) => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ARTICLES_ROOT_QUERY_KEY }),
        onSuccess?.(data, variables, context),
      ]);
    },

    onError,

    onSettled,
  });
}
