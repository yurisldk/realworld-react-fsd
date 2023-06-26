import { InfiniteData, QueryClient, useMutation } from '@tanstack/react-query';
import { articleApi } from '~entities/article';
import {
  ArticleDto,
  GenericErrorModel,
  realworldApi,
} from '~shared/api/realworld';
import { updateInfinityData } from '../lib';

type ArticlesInfinityData = InfiniteData<ArticleDto[]>;

type MutateFnType = typeof realworldApi.articles.createArticleFavorite;

export const useMutateFavoriteArticle = (
  mutateFn: MutateFnType,
  queryClient: QueryClient,
) =>
  useMutation<
    ArticleDto,
    GenericErrorModel,
    ArticleDto,
    {
      articlesQueryKey: string[];
      articleQueryKey: string[];
      prevArticle: ArticleDto;
    }
  >(
    async (article: ArticleDto) => {
      const response = await mutateFn(article.slug);
      return response.data.article;
    },

    {
      // We have to optimistic update article as part of articles list and single article to avoid desynchronize when user favorite article then instant switch beetwen single page / articles list etc... and have old state before our query refetched.
      onMutate: async (newArticle) => {
        const articlesQueryKey = articleApi.articleKeys.articles.root;
        const articleQueryKey = articleApi.articleKeys.article.slug(
          newArticle.slug,
        );

        // Cancel any articles and article with slug refetches
        await queryClient.cancelQueries({ queryKey: articlesQueryKey });
        await queryClient.cancelQueries({ queryKey: articleQueryKey });

        // Snapshot the previous article.
        const prevArticle: ArticleDto = {
          ...newArticle,
          favorited: !newArticle.favorited,
          favoritesCount: newArticle.favorited
            ? newArticle.favoritesCount - 1
            : newArticle.favoritesCount + 1,
        };

        // Optimistically update to the new value
        queryClient.setQueriesData<ArticlesInfinityData>(
          articlesQueryKey,
          /* c8 ignore start */
          (prevInfinityData) => {
            if (!prevInfinityData) return undefined;
            return updateInfinityData(prevInfinityData, newArticle);
          },
          /* c8 ignore end */
        );

        queryClient.setQueryData<ArticleDto>(articleQueryKey, newArticle);

        // Return a context object with the snapshotted value and query keys
        return { articlesQueryKey, articleQueryKey, prevArticle };
      },

      // If the mutation fails,
      // use the context returned from onMutate to roll back
      onError: (_error, _variables, context) => {
        if (!context) return;

        const { articlesQueryKey, articleQueryKey, prevArticle } = context;

        queryClient.setQueriesData<ArticlesInfinityData>(
          articlesQueryKey,
          /* c8 ignore start */
          (newInfinityData) => {
            if (!newInfinityData) return undefined;
            return updateInfinityData(newInfinityData, prevArticle);
          },
          /* c8 ignore end */
        );

        queryClient.setQueryData<ArticleDto>(articleQueryKey, prevArticle);
      },

      // Always refetch after error or success:
      onSettled: (_data, _error, _variables, context) => {
        if (!context) return;

        const { articlesQueryKey, articleQueryKey } = context;

        queryClient.invalidateQueries({ queryKey: articlesQueryKey });
        queryClient.invalidateQueries({ queryKey: articleQueryKey });
      },
    },
  );
