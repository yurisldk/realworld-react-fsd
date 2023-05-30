import { useInfiniteQuery } from '@tanstack/react-query';
import { conduitApi } from '~shared/api';

export const useGlobalArticles = () =>
  useInfiniteQuery({
    queryKey: ['articles', 'global'],
    queryFn: async ({ pageParam = 0 }) =>
      conduitApi.Articles.global({ limit: '10', offset: pageParam }),
    getNextPageParam: (lastPage, pages) => {
      const { articlesCount } = lastPage;
      const maybeNextPageParams = pages.length * 10; // 10 is limit value

      const nextPageParam =
        maybeNextPageParams >= articlesCount ? null : maybeNextPageParams;

      return nextPageParam;
    },
  });
