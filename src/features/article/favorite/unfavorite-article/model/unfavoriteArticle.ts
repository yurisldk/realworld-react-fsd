import { QueryClient } from '@tanstack/react-query';
import { realworldApi } from '~shared/api/realworld';
import { useMutateFavoriteArticle } from '../../base/model/baseModel';

export const useMutationUnfavoriteArticle = (
  queryKey: unknown[],
  queryClient: QueryClient,
) =>
  useMutateFavoriteArticle(
    queryKey,
    realworldApi.articles.deleteArticleFavorite,
    queryClient,
  );
