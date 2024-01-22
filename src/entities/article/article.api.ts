import { sessionModel } from '~entities/session';
import { baseUrl } from '~shared/api/realworld';
import { createJsonMutation, createJsonQuery } from '~shared/lib/fetch';
import { zodContract } from '~shared/lib/zod';
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
import type {
  ArticlesFeedQueryDto,
  ArticlesQueryDto,
  CreateArticle,
  UpdateArticle,
} from './article.types';

export async function articlesQuery(
  params: { query: ArticlesQueryDto },
  signal?: AbortSignal,
) {
  return createJsonQuery({
    request: {
      url: baseUrl('/articles'),
      method: 'GET',
      headers: { ...sessionModel.authorizationHeader() },
      query: params.query,
    },
    response: {
      contract: zodContract(ArticlesDtoSchema),
      mapData: mapArticles,
    },
    abort: signal,
  });
}

export async function articlesFeedQuery(
  params: { query: ArticlesFeedQueryDto },
  signal?: AbortSignal,
) {
  return createJsonQuery({
    request: {
      url: baseUrl('/articles/feed'),
      method: 'GET',
      headers: { ...sessionModel.authorizationHeader() },
      query: params.query,
    },
    response: {
      contract: zodContract(ArticlesDtoSchema),
      mapData: mapArticles,
    },
    abort: signal,
  });
}

export async function articleQuery(
  params: { slug: string },
  signal?: AbortSignal,
) {
  return createJsonQuery({
    request: {
      url: baseUrl(`/articles/${params.slug}`),
      method: 'GET',
      headers: { ...sessionModel.authorizationHeader() },
    },
    response: {
      contract: zodContract(ArticleResponseSchema),
      mapData: ({ article }) => mapArticle(article),
    },
    abort: signal,
  });
}

export async function createArticleMutation(params: {
  article: CreateArticle;
}) {
  return createJsonMutation({
    request: {
      url: baseUrl('/articles'),
      method: 'POST',
      headers: { ...sessionModel.authorizationHeader() },
      body: JSON.stringify({ article: mapCreateDtoArticle(params.article) }),
    },
    response: {
      contract: zodContract(ArticleResponseSchema),
      mapData: ({ article }) => mapArticle(article),
    },
  });
}

export async function deleteArticleMutation(params: { slug: string }) {
  return createJsonMutation({
    request: {
      url: baseUrl(`/articles/${params.slug}`),
      method: 'DELETE',
      headers: { ...sessionModel.authorizationHeader() },
    },
    response: {
      contract: zodContract(EmptySchema),
    },
  });
}

export async function updateArticleMutation(params: {
  slug: string;
  article: UpdateArticle;
}) {
  return createJsonMutation({
    request: {
      url: baseUrl(`/articles/${params.slug}`),
      method: 'PUT',
      headers: { ...sessionModel.authorizationHeader() },
      body: JSON.stringify({ article: mapUpdateDtoArticle(params.article) }),
    },
    response: {
      contract: zodContract(ArticleResponseSchema),
      mapData: ({ article }) => mapArticle(article),
    },
  });
}

export async function favoriteArticleMutation(params: { slug: string }) {
  return createJsonMutation({
    request: {
      url: baseUrl(`/articles/${params.slug}/favorite`),
      method: 'POST',
      headers: { ...sessionModel.authorizationHeader() },
    },
    response: {
      contract: zodContract(ArticleResponseSchema),
      mapData: ({ article }) => mapArticle(article),
    },
  });
}

export async function unfavoriteArticleMutation(params: { slug: string }) {
  return createJsonMutation({
    request: {
      url: baseUrl(`/articles/${params.slug}/favorite`),
      method: 'DELETE',
      headers: { ...sessionModel.authorizationHeader() },
    },
    response: {
      contract: zodContract(ArticleResponseSchema),
      mapData: ({ article }) => mapArticle(article),
    },
  });
}
