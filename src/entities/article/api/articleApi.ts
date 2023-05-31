import { useInfiniteQuery } from '@tanstack/react-query';
import { conduitApi } from '~shared/api';

// TODO: refactor these

export const useGlobalArticles = () =>
  useInfiniteQuery({
    queryKey: ['articles', 'global'],
    queryFn: async ({ pageParam = 0, signal }) =>
      conduitApi.Articles.global({ limit: '10', offset: pageParam }, signal),
    getNextPageParam: (lastPage, pages) => {
      const { articlesCount } = lastPage;
      const maybeNextPageParams = pages.length * 10; // 10 is limit value

      const nextPageParam =
        maybeNextPageParams >= articlesCount ? null : maybeNextPageParams;

      return nextPageParam;
    },
  });

export const useUserFeedArticles = () =>
  useInfiniteQuery({
    queryKey: ['articles', 'userfeed'],
    queryFn: async ({ pageParam = 0, signal }) =>
      conduitApi.Articles.userFeed({ limit: '10', offset: pageParam }, signal),
    getNextPageParam: (lastPage, pages) => {
      const { articlesCount } = lastPage;
      const maybeNextPageParams = pages.length * 10; // 10 is limit value

      const nextPageParam =
        maybeNextPageParams >= articlesCount ? null : maybeNextPageParams;

      return nextPageParam;
    },
  });

export const useTagArticles = (tag: string) =>
  useInfiniteQuery({
    queryKey: ['articles', 'tag', tag],
    queryFn: async ({ pageParam = 0, signal }) =>
      conduitApi.Articles.global(
        { limit: '10', offset: pageParam, tag },
        signal,
      ),
    getNextPageParam: (lastPage, pages) => {
      const { articlesCount } = lastPage;
      const maybeNextPageParams = pages.length * 10; // 10 is limit value

      const nextPageParam =
        maybeNextPageParams >= articlesCount ? null : maybeNextPageParams;

      return nextPageParam;
    },
  });
