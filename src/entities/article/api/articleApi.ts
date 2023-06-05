import { useInfiniteQuery } from '@tanstack/react-query';
import { realworldApi } from '~shared/api/realworld';
import { ArticleFilter } from '../model/articleFilterModel';

export const useUserFeedArticles = (queryKey: string[]) =>
  useInfiniteQuery({
    queryKey: ['articles', ...queryKey],
    queryFn: async ({ pageParam = 0, signal }) => {
      const response = await realworldApi.articles.getArticlesFeed(
        { limit: 10, offset: pageParam },
        { signal },
      );
      return response.data;
    },

    getNextPageParam: (lastPage, pages) => {
      const { articlesCount } = lastPage;
      const maybeNextPageParams = pages.length * 10; // 10 is limit value

      const nextPageParam =
        maybeNextPageParams >= articlesCount ? null : maybeNextPageParams;

      return nextPageParam;
    },
  });

// TODO: try to use queryKey from filter
export const useCommonInfinityArticles = (
  queryKey: string[],
  query?: Omit<ArticleFilter, 'userfeed' | 'global'>,
  secure?: boolean,
) => {
  const searchParams = { limit: 10, offset: 0, ...query };

  return useInfiniteQuery({
    queryKey: ['articles', ...queryKey],

    queryFn: async ({ pageParam = searchParams.offset, signal }) => {
      const response = await realworldApi.articles.getArticles(
        { ...searchParams, offset: pageParam },
        { signal, secure },
      );

      return response.data;
    },

    getNextPageParam: (lastPage, pages) => {
      const { articlesCount } = lastPage;
      const maybeNextPageParams = pages.length * searchParams.limit;

      const nextPageParam =
        maybeNextPageParams >= articlesCount ? null : maybeNextPageParams;

      return nextPageParam;
    },
  });
};
