import { QueryClient } from '@tanstack/react-query';
import { realworldApi } from '~shared/api/realworld';
import { useMutateFavoriteArticle } from '../../base';

export const useMutationUnfavoriteArticle = (queryClient: QueryClient) =>
  useMutateFavoriteArticle(
    realworldApi.articles.deleteArticleFavorite,
    queryClient,
  );
