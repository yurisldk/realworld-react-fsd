import { DefaultError, useMutation, UseMutationOptions } from '@tanstack/react-query';
import { createArticle } from '~shared/api/api.service';
import { queryClient } from '~shared/queryClient';
import { ARTICLES_ROOT_QUERY_KEY } from '~entities/article/article.api';
import { transformArticleDtoToArticle } from '~entities/article/article.lib';
import { Article } from '~entities/article/article.types';
import { transformCreateArticleToCreateArticleDto } from './create-article.lib';
import { CreateArticle } from './create-article.types';

export function useCreateArticleMutation(
  options: Pick<
    UseMutationOptions<Article, DefaultError, CreateArticle, unknown>,
    'mutationKey' | 'onMutate' | 'onSuccess' | 'onError' | 'onSettled'
  > = {},
) {
  const { mutationKey = [], onMutate, onSuccess, onError, onSettled } = options;

  return useMutation({
    mutationKey: ['article', 'create', ...mutationKey],

    mutationFn: async (createArticleData: CreateArticle) => {
      const createArticleDto = transformCreateArticleToCreateArticleDto(createArticleData);
      const { data } = await createArticle(createArticleDto);
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
