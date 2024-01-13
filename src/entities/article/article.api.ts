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

export const ARTICLES_KEY = ['article', 'articles'];
export const articlesQuery = createQuery({
  params: declareParams<ArticlesQueryDto>(),
  request: {
    url: baseUrl('/articles'),
    method: 'GET',
    query: (query) => query,
  },
  response: {
    contract: zodContract(ArticlesDtoSchema),
    mapData: ({ result }) => mapArticles(result),
  },
});

export const ARTICLES_FEED_KEY = ['article', 'articlesFeed'];
export const articlesFeedQuery = createQuery({
  params: declareParams<ArticlesFeedQueryDto>(),
  request: {
    url: baseUrl('/articles/feed'),
    method: 'GET',
    headers: (headers) => {
      headers.Authorization = sessionModel.authorization.accessToken;
    },
    query: (query) => query,
  },
  response: {
    contract: zodContract(ArticlesDtoSchema),
    mapData: ({ result }) => mapArticles(result),
  },
});

export const ARTICLE_KEY = ['article', 'article'];
export const articleQuery = createQuery({
  params: declareParams<string>(),
  request: {
    url: (slug) => baseUrl(`/articles/${slug}`),
    method: 'GET',
  },
  response: {
    contract: zodContract(ArticleResponseSchema),
    mapData: ({ result }) => mapArticle(result.article),
  },
});

export const CREATE_ARTICLE_KEY = ['article', 'createArticle'];
export const createArticleMutation = createQuery({
  params: declareParams<CreateArticle>(),
  request: {
    url: baseUrl(`/articles`),
    method: 'POST',
    headers: (headers) => {
      headers.Authorization = sessionModel.authorization.accessToken;
    },
    body: (article) => ({ article: mapCreateDtoArticle(article) }),
  },
  response: {
    contract: zodContract(ArticleResponseSchema),
    mapData: ({ result }) => mapArticle(result.article),
  },
});

export const DELETE_ARTICLE_KEY = ['article', 'deleteArticle'];
export const deleteArticleMutation = createQuery({
  params: declareParams<string>(),
  request: {
    url: (slug) => baseUrl(`/articles/${slug}`),
    method: 'DELETE',
    headers: (headers) => {
      headers.Authorization = sessionModel.authorization.accessToken;
    },
  },
  response: {
    contract: zodContract(EmptySchema),
    mapData: () => ({}),
  },
});

export const UPDATE_ARTICLE_KEY = ['article', 'updateArticle'];
export const updateArticleMutation = createQuery({
  params: declareParams<{ slug: string; article: UpdateArticle }>(),
  request: {
    url: ({ slug }) => baseUrl(`/articles/${slug}`),
    method: 'PUT',
    headers: (headers) => {
      headers.Authorization = sessionModel.authorization.accessToken;
    },
    body: ({ article }) => ({ article: mapUpdateDtoArticle(article) }),
  },
  response: {
    contract: zodContract(ArticleResponseSchema),
    mapData: ({ result }) => mapArticle(result.article),
  },
});

export const FAVORITE_ARTICLE_KEY = ['article', 'favorite'];
export const favoriteArticleMutation = createQuery({
  params: declareParams<string>(),
  request: {
    url: (slug) => baseUrl(`/articles/${slug}/favorite`),
    method: 'POST',
    headers: (headers) => {
      headers.Authorization = sessionModel.authorization.accessToken;
    },
  },
  response: {
    contract: zodContract(ArticleResponseSchema),
    mapData: ({ result }) => mapArticle(result.article),
  },
});

export const UNFAVORITE_ARTICLE_KEY = ['article', 'unfavorite'];
export const unfavoriteArticleMutation = createQuery({
  params: declareParams<string>(),
  request: {
    url: (slug) => baseUrl(`/articles/${slug}/favorite`),
    method: 'DELETE',
    headers: (headers) => {
      headers.Authorization = sessionModel.authorization.accessToken;
    },
  },
  response: {
    contract: zodContract(ArticleResponseSchema),
    mapData: ({ result }) => mapArticle(result.article),
  },
});
