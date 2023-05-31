import { useInfiniteQuery } from '@tanstack/react-query';
import { conduitApi } from '~shared/api';

export const useUserFeedArticles = (queryKey: string[]) =>
  useInfiniteQuery({
    queryKey: ['articles', ...queryKey],
    queryFn: async ({ pageParam = 0, signal }) =>
      conduitApi.Articles.userFeed({ limit: 10, offset: pageParam }, signal),
    getNextPageParam: (lastPage, pages) => {
      const { articlesCount } = lastPage;
      const maybeNextPageParams = pages.length * 10; // 10 is limit value

      const nextPageParam =
        maybeNextPageParams >= articlesCount ? null : maybeNextPageParams;

      return nextPageParam;
    },
  });

export const useInfinityArticles = (
  queryKey: string[],
  params?: conduitApi.ArticlesGlobalParams,
) => {
  const searchParams = { limit: 10, offset: 0, ...params };

  return useInfiniteQuery({
    queryKey: ['articles', ...queryKey],

    queryFn: async ({ pageParam = searchParams.offset, signal }) =>
      conduitApi.Articles.global(
        { ...searchParams, offset: pageParam },
        signal,
      ),

    getNextPageParam: (lastPage, pages) => {
      const { articlesCount } = lastPage;
      const maybeNextPageParams = pages.length * searchParams.limit;

      const nextPageParam =
        maybeNextPageParams >= articlesCount ? null : maybeNextPageParams;

      return nextPageParam;
    },
  });
};
