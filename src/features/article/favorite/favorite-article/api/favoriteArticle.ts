import { QueryClient } from '@tanstack/react-query';
import { realworldApi } from '~shared/api/realworld';
import { useMutateFavoriteArticle } from '../../base';

export const useMutationFavoriteArticle = (queryClient: QueryClient) =>
  useMutateFavoriteArticle(
    realworldApi.articles.createArticleFavorite,
    queryClient,
  );
