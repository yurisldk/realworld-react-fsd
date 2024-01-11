import { InfiniteData, QueryClient, useMutation } from '@tanstack/react-query';
import { articleApi } from '~entities/article';
import { GenericErrorModel, realworldApi } from '~shared/api/realworld';
import { updateInfinityData } from '../lib';

type ArticlesInfinityData = InfiniteData<articleApi.Article[]>;

type MutateFnType = typeof realworldApi.articles.createArticleFavorite;

export const useMutateFavoriteArticle = (
  mutationKey: string[],
  mutateFn: MutateFnType,
  queryClient: QueryClient,
) =>
  useMutation<
    articleApi.Article,
    GenericErrorModel,
    articleApi.Article,
    {
      articlesQueryKey: string[];
      articleQueryKey: string[];
      prevArticle: articleApi.Article;
    }
  >({
    mutationKey,
    mutationFn: async (article: articleApi.Article) => {
      const response = await mutateFn(article.slug);
      return articleApi.mapArticle(response.data.article);
    },
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
      const prevArticle: articleApi.Article = {
        ...newArticle,
        favorited: !newArticle.favorited,
        favoritesCount: newArticle.favorited
          ? newArticle.favoritesCount - 1
          : newArticle.favoritesCount + 1,
      };

      // Optimistically update to the new value
      queryClient.setQueriesData<ArticlesInfinityData>(
        { queryKey: articlesQueryKey },
        /* c8 ignore start */
        (prevInfinityData) => {
          if (!prevInfinityData) return undefined;
          return updateInfinityData(prevInfinityData, newArticle);
        },
        /* c8 ignore end */
      );

      queryClient.setQueryData<articleApi.Article>(articleQueryKey, newArticle);

      // Return a context object with the snapshotted value and query keys
      return { articlesQueryKey, articleQueryKey, prevArticle };
    },

    // If the mutation fails,
    // use the context returned from onMutate to roll back
    onError: (_error, _variables, context) => {
      if (!context) return;

      const { articlesQueryKey, articleQueryKey, prevArticle } = context;

      queryClient.setQueriesData<ArticlesInfinityData>(
        { queryKey: articlesQueryKey },
        /* c8 ignore start */
        (newInfinityData) => {
          if (!newInfinityData) return undefined;
          return updateInfinityData(newInfinityData, prevArticle);
        },
        /* c8 ignore end */
      );

      queryClient.setQueryData<articleApi.Article>(
        articleQueryKey,
        prevArticle,
      );
    },

    // Always refetch after error or success:
    onSettled: (_data, _error, _variables, context) => {
      if (!context) return;

      const { articlesQueryKey, articleQueryKey } = context;

      queryClient.invalidateQueries({ queryKey: articlesQueryKey });
      queryClient.invalidateQueries({ queryKey: articleQueryKey });
    },
  });
