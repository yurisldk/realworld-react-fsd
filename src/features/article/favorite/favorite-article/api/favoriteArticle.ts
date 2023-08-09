import { QueryClient } from '@tanstack/react-query';
import { articleApi } from '~entities/article';
import { realworldApi } from '~shared/api/realworld';
import { useMutateFavoriteArticle } from '../../base';

export const useMutationFavoriteArticle = (queryClient: QueryClient) =>
  useMutateFavoriteArticle(
    articleApi.articleKeys.mutation.favorite(),
    realworldApi.articles.createArticleFavorite,
    queryClient,
  );
