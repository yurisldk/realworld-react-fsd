import { DefaultError, useMutation, UseMutationOptions } from '@tanstack/react-query';
import { favoriteArticle } from '~shared/api/api.service';
import { queryClient } from '~shared/queryClient';
import { ARTICLES_ROOT_QUERY_KEY } from '~entities/article/article.api';
import { ArticleSchema, ArticlesSchema } from '~entities/article/article.contracts';
import { transformArticleDtoToArticle } from '~entities/article/article.lib';
import { Article, Articles } from '~entities/article/article.types';

export function useFavoriteArticleMutation(
  options: Pick<
    UseMutationOptions<Article, DefaultError, string, { previousArticles: unknown }>,
    'mutationKey' | 'onMutate' | 'onSuccess' | 'onError' | 'onSettled'
  > = {},
) {
  const { mutationKey = [], onMutate, onSuccess, onError, onSettled } = options;

  return useMutation({
    mutationKey: ['article', 'favorite', ...mutationKey],

    mutationFn: async (slug: string) => {
      const { data } = await favoriteArticle(slug);
      const article = transformArticleDtoToArticle(data);
      return article;
    },

    onMutate: async (slug) => {
      await queryClient.cancelQueries({ queryKey: ARTICLES_ROOT_QUERY_KEY });

      const previousArticles = queryClient.getQueriesData({
        queryKey: ARTICLES_ROOT_QUERY_KEY,
      });

      queryClient.setQueriesData({ queryKey: ARTICLES_ROOT_QUERY_KEY }, (rawData) => {
        if (!rawData) {
          return rawData;
        }

        const { data: article } = ArticleSchema.safeParse(rawData);
        if (article && article.slug === slug) {
          return {
            ...article,
            favorited: true,
            favoritesCount: article.favoritesCount + 1,
          } as Article;
        }

        const { data: articlesData } = ArticlesSchema.safeParse(rawData);
        if (articlesData && articlesData.articles[slug]) {
          const { articles, articlesCount } = articlesData;
          return {
            articles: {
              ...articles,
              [slug]: {
                ...articles[slug],
                favorited: true,
                favoritesCount: articles[slug].favoritesCount + 1,
              },
            },
            articlesCount,
          } as Articles;
        }

        return rawData;
      });

      await onMutate?.(slug);

      return { previousArticles };
    },

    onSuccess,

    onError: async (error, slug, context) => {
      queryClient.setQueriesData({ queryKey: ARTICLES_ROOT_QUERY_KEY }, context?.previousArticles);
      await onError?.(error, slug, context);
    },

    onSettled: async (data, error, variables, context) => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ARTICLES_ROOT_QUERY_KEY }),
        onSettled?.(data, error, variables, context),
      ]);
    },
  });
}
