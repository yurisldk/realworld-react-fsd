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
import { ArticleFilter } from '../model/articleFilterModel';

export const articleKeys = {
  articles: {
    root: ['articles'],
    query: (query: ArticleFilter) => [...articleKeys.articles.root, query],
  },

  article: {
    root: ['article'],
    slug: (slug: string) => [...articleKeys.article.root, slug],
  },
};

type UseInfinityArticlesProps = {
  queryKey: unknown[];
  queryFn: typeof realworldApi.articles.getArticles;
  query?: ArticleFilter;
  params?: RequestParams;
};

const useInfinityArticles = ({
  queryKey,
  queryFn,
  query,
  params,
}: UseInfinityArticlesProps) => {
  const { userfeed, global, ...validQuery } = query || {};
  const searchParams = { limit: 10, offset: 0, ...validQuery };

  return useInfiniteQuery<
    ArticleDto[],
    GenericErrorModel,
    ArticleDto[],
    unknown[]
  >({
    queryKey,

    queryFn: async ({ pageParam = searchParams.offset, signal }) => {
      const response = await queryFn(
        { ...searchParams, offset: pageParam },
        { signal, ...params },
      );

      return response.data.articles;
    },

    getNextPageParam: (lastPage, pages) => {
      const nextPageParam = lastPage.length
        ? pages.length * searchParams.limit
        : null;

      return nextPageParam;
    },
  });
};

export const useCommonInfinityArticles = (
  query?: ArticleFilter,
  params?: RequestParams,
) =>
  useInfinityArticles({
    queryKey: articleKeys.articles.query({
      limit: 0,
      offset: 10,
      ...query,
    }),
    queryFn: realworldApi.articles.getArticles,
    query,
    params,
  });

export const useFeedInfinityArticles = (
  query?: ArticleFilter,
  params?: RequestParams,
) =>
  useInfinityArticles({
    queryKey: articleKeys.articles.query({
      limit: 0,
      offset: 10,
      ...query,
    }),
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
