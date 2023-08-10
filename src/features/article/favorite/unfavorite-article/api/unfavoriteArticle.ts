import { QueryClient } from '@tanstack/react-query';
import { articleApi } from '~entities/article';
import { realworldApi } from '~shared/api/realworld';
import { useMutateFavoriteArticle } from '../../base';

export const useMutationUnfavoriteArticle = (queryClient: QueryClient) =>
  useMutateFavoriteArticle(
    articleApi.articleKeys.mutation.unfavorite(),
    realworldApi.articles.deleteArticleFavorite,
    queryClient,
  );
