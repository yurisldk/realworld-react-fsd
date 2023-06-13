import {
  UseQueryOptions,
  useInfiniteQuery,
  useQuery,
} from '@tanstack/react-query';
import {
  ArticleDto,
  GenericErrorModel,
  RequestParams,
  realworldApi,
} from '~shared/api/realworld';

export type GlobalfeedQuery = {
  tag?: string;
  author?: string;
  favorited?: string;
  offset: number;
  limit: number;
};

export type UserfeedQuery = {
  offset: number;
  limit: number;
};

export const articleKeys = {
  articles: {
    root: ['articles'],
    globalfeed: {
      root: () => [...articleKeys.articles.root, 'globalfeed'],
      query: (query: GlobalfeedQuery) => [
        ...articleKeys.articles.globalfeed.root(),
        query,
      ],
    },
    userfeed: {
      root: () => [...articleKeys.articles.root, 'userfeed'],
      query: (query: GlobalfeedQuery) => [
        ...articleKeys.articles.userfeed.root(),
        query,
      ],
    },
  },

  article: {
    root: ['article'],
    slug: (slug: string) => [...articleKeys.article.root, slug],
  },
};

type UseInfinityArticlesProps = {
  queryKey: unknown[];
  queryFn: typeof realworldApi.articles.getArticles;
  query: GlobalfeedQuery | UserfeedQuery;
  params?: RequestParams;
};

const useInfinityArticles = ({
  queryKey,
  queryFn,
  query,
  params,
}: UseInfinityArticlesProps) => {
  const { offset, limit } = query;

  return useInfiniteQuery<
    ArticleDto[],
    GenericErrorModel,
    ArticleDto[],
    unknown[]
  >({
    queryKey,

    queryFn: async ({ pageParam = offset, signal }) => {
      const response = await queryFn(
        { ...query, offset: pageParam },
        { signal, ...params },
      );

      return response.data.articles;
    },

    getNextPageParam: (lastPage, pages) => {
      if (lastPage.length < limit) return null;

      const nextPageParam = lastPage.length ? pages.length * limit : null;

      return nextPageParam;
    },
  });
};

export const useCommonInfinityArticles = (
  query: GlobalfeedQuery,
  params?: RequestParams,
) =>
  useInfinityArticles({
    queryKey: articleKeys.articles.globalfeed.query(query),
    queryFn: realworldApi.articles.getArticles,
    query,
    params,
  });

export const useFeedInfinityArticles = (
  query: UserfeedQuery,
  params?: RequestParams,
) =>
  useInfinityArticles({
    queryKey: articleKeys.articles.userfeed.query(query),
    queryFn: realworldApi.articles.getArticlesFeed,
    query,
    params,
  });

type UseArticleQuery = UseQueryOptions<
  ArticleDto,
  GenericErrorModel,
  ArticleDto,
  string[]
>;
type UseArticleQueryOptions = Omit<UseArticleQuery, 'queryKey' | 'queryFn'>;

export const useArticle = (
  slug: string,
  params?: RequestParams,
  options?: UseArticleQueryOptions,
) =>
  useQuery({
    queryKey: articleKeys.article.slug(slug),

    queryFn: async ({ signal }) => {
      const response = await realworldApi.articles.getArticle(slug, {
        signal,
        ...params,
      });

      return response.data.article;
    },

    ...options,
  });
