import { QueryClient } from '@tanstack/react-query';
import { realworldApi } from '~shared/api/realworld';
import { useMutateFavoriteArticle } from '../../base/model/baseModel';

export const useMutationFavoriteArticle = (
  queryKey: unknown[],
  queryClient: QueryClient,
) =>
  useMutateFavoriteArticle(
    queryKey,
    realworldApi.articles.createArticleFavorite,
    queryClient,
  );
