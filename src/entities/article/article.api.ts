import { keepPreviousData, queryOptions } from '@tanstack/react-query';
import { getAllArticles, getArticleBySlug, getFeedArticles } from '~shared/api/api.service';
import { queryClient } from '~shared/queryClient';
import {
  transformArticleDtoToArticle,
  transformArticlesDtoToArticles,
  transformFilterQueryToFilterQueryDto,
} from './article.lib';
import { Article, Articles, FilterQuery } from './article.types';

export const ARTICLES_ROOT_QUERY_KEY = ['articles'];

export const articleQueryOptions = (slug: string) =>
  queryOptions({
    queryKey: [...ARTICLES_ROOT_QUERY_KEY, slug],

    queryFn: async ({ signal }) => {
      const { data } = await getArticleBySlug(slug, { signal });
      const article = transformArticleDtoToArticle(data);
      return article;
    },

    initialData: () => queryClient.getQueryData<Article>(['article', slug]),

    initialDataUpdatedAt: () => queryClient.getQueryState(['article', slug])?.dataUpdatedAt,
  });

export const articlesQueryOptions = (filter: FilterQuery) => {
  const { source } = filter;
  const isGlobal = source === 'global';
  const filterDto = transformFilterQueryToFilterQueryDto(filter);

  return queryOptions({
    queryKey: [...ARTICLES_ROOT_QUERY_KEY, filter],

    queryFn: async ({ signal }) => {
      const config = { signal, params: filterDto };
      const request = isGlobal ? getAllArticles(config) : getFeedArticles(config);
      const { data } = await request;
      const articles = transformArticlesDtoToArticles(data);
      return articles;
    },

    placeholderData: keepPreviousData,

    initialData: () => queryClient.getQueryData<Articles>([...ARTICLES_ROOT_QUERY_KEY, filter]),

    initialDataUpdatedAt: () => queryClient.getQueryState([...ARTICLES_ROOT_QUERY_KEY, filter])?.dataUpdatedAt,
  });
};
