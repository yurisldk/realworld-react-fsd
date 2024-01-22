import { sessionModel } from '~entities/session';
import { baseUrl } from '~shared/api/realworld';
import {
  createQuery,
  declareParams,
  zodContract,
} from '~shared/lib/json-query';
import {
  ArticleResponseSchema,
  ArticlesDtoSchema,
  EmptySchema,
} from './article.contracts';
import {
  mapArticle,
  mapArticles,
  mapCreateDtoArticle,
  mapUpdateDtoArticle,
} from './article.lib';
import {
  ArticlesFeedQueryDto,
  ArticlesQueryDto,
  CreateArticle,
  UpdateArticle,
} from './article.types';

export const articlesQuery = createQuery({
  params: declareParams<ArticlesQueryDto>(),
  request: {
    url: baseUrl('/articles'),
    method: 'GET',
    headers: () => ({ ...sessionModel.authorizationHeader() }),
    query: (query) => query,
  },
  response: {
    contract: zodContract(ArticlesDtoSchema),
    mapData: ({ result }) => mapArticles(result),
  },
});

export const articlesFeedQuery = createQuery({
  params: declareParams<ArticlesFeedQueryDto>(),
  request: {
    url: baseUrl('/articles/feed'),
    method: 'GET',
    headers: () => ({ ...sessionModel.authorizationHeader() }),
    query: (query) => query,
  },
  response: {
    contract: zodContract(ArticlesDtoSchema),
    mapData: ({ result }) => mapArticles(result),
  },
});

export const articleQuery = createQuery({
  params: declareParams<string>(),
  request: {
    url: (slug) => baseUrl(`/articles/${slug}`),
    method: 'GET',
    headers: () => ({ ...sessionModel.authorizationHeader() }),
  },
  response: {
    contract: zodContract(ArticleResponseSchema),
    mapData: ({ result }) => mapArticle(result.article),
  },
});

export const createArticleMutation = createQuery({
  params: declareParams<CreateArticle>(),
  request: {
    url: baseUrl(`/articles`),
    method: 'POST',
    headers: () => ({ ...sessionModel.authorizationHeader() }),
    body: (article) => ({ article: mapCreateDtoArticle(article) }),
  },
  response: {
    contract: zodContract(ArticleResponseSchema),
    mapData: ({ result }) => mapArticle(result.article),
  },
});

export const deleteArticleMutation = createQuery({
  params: declareParams<string>(),
  request: {
    url: (slug) => baseUrl(`/articles/${slug}`),
    method: 'DELETE',
    headers: () => ({ ...sessionModel.authorizationHeader() }),
  },
  response: {
    contract: zodContract(EmptySchema),
    mapData: () => ({}),
  },
});

export const updateArticleMutation = createQuery({
  params: declareParams<{ slug: string; article: UpdateArticle }>(),
  request: {
    url: ({ slug }) => baseUrl(`/articles/${slug}`),
    method: 'PUT',
    headers: () => ({ ...sessionModel.authorizationHeader() }),
    body: ({ article }) => ({ article: mapUpdateDtoArticle(article) }),
  },
  response: {
    contract: zodContract(ArticleResponseSchema),
    mapData: ({ result }) => mapArticle(result.article),
  },
});

export const favoriteArticleMutation = createQuery({
  params: declareParams<string>(),
  request: {
    url: (slug) => baseUrl(`/articles/${slug}/favorite`),
    method: 'POST',
    headers: () => ({ ...sessionModel.authorizationHeader() }),
  },
  response: {
    contract: zodContract(ArticleResponseSchema),
    mapData: ({ result }) => mapArticle(result.article),
  },
});

export const unfavoriteArticleMutation = createQuery({
  params: declareParams<string>(),
  request: {
    url: (slug) => baseUrl(`/articles/${slug}/favorite`),
    method: 'DELETE',
    headers: () => ({ ...sessionModel.authorizationHeader() }),
  },
  response: {
    contract: zodContract(ArticleResponseSchema),
    mapData: ({ result }) => mapArticle(result.article),
  },
});
