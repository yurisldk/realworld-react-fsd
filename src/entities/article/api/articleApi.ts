import {
  UseQueryOptions,
  useInfiniteQuery,
  useQuery,
} from '@tanstack/react-query';
import {
  ArticleDto,
  GenericErrorModelDto,
  HttpResponse,
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
  query?: ArticleFilter;
  params?: RequestParams;
};

const useInfinityArticles = ({
  queryKey,
  query,
  params,
}: UseInfinityArticlesProps) => {
  const { userfeed, global, ...validQuery } = query || {};
  const searchParams = { limit: 10, offset: 0, ...validQuery };

  return useInfiniteQuery({
    queryKey,

    queryFn: async ({ pageParam = searchParams.offset, signal }) => {
      const queryFn = query?.userfeed
        ? realworldApi.articles.getArticlesFeed
        : realworldApi.articles.getArticles;

      const response = await queryFn(
        { ...searchParams, offset: pageParam },
        { signal, ...params },
      );

      return response.data.articles;
    },

    getNextPageParam: (lastPage, pages) => {
      const nextPageParam = lastPage.length ? pages.length * 10 : null;

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
    query,
    params,
  });

type UseArticleQuery = UseQueryOptions<
  ArticleDto,
  HttpResponse<unknown, GenericErrorModelDto>,
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
