import { handleMutationIssue } from '~shared/lib/error'
import { createJsonQuery, createJsonMutation } from '../../lib/fetch'
import { authHeaderService, getUrl } from '../api.service'
import { ArticleDtoSchema, ArticlesDtoSchema } from './article.contracts'
import {
  ArticlesQueryDto,
  ArticlesFeedQueryDto,
  CreateArticleDto,
  UpdateArticleDto,
} from './article.types'

export class ArticleService {
  static articlesQuery(
    params: { query: ArticlesQueryDto },
    signal?: AbortSignal,
  ) {
    return createJsonQuery({
      request: {
        url: getUrl('/articles'),
        method: 'GET',
        headers: authHeaderService.getHeader(),
        query: params.query,
      },
      response: { contract: ArticlesDtoSchema },
      abort: signal,
    })
  }

  static articlesFeedQuery(
    params: { query: ArticlesFeedQueryDto },
    signal?: AbortSignal,
  ) {
    return createJsonQuery({
      request: {
        url: getUrl('/articles/feed'),
        method: 'GET',
        headers: authHeaderService.getHeader(),
        query: params.query,
      },
      response: { contract: ArticlesDtoSchema },
      abort: signal,
    })
  }

  static articleQuery(params: { slug: string }, signal?: AbortSignal) {
    return createJsonQuery({
      request: {
        url: getUrl(`/articles/${params.slug}`),
        method: 'GET',
        headers: authHeaderService.getHeader(),
      },
      response: { contract: ArticleDtoSchema },
      abort: signal,
    })
  }

  static createArticleMutation(params: { createArticleDto: CreateArticleDto }) {
    return createJsonMutation({
      request: {
        url: getUrl('/articles'),
        method: 'POST',
        headers: authHeaderService.getHeader(),
        body: JSON.stringify({ article: params.createArticleDto }),
      },
      response: { contract: ArticleDtoSchema },
    }).catch((e) => {
      throw handleMutationIssue(e)
    })
  }

  static deleteArticleMutation(params: { slug: string }) {
    return createJsonMutation({
      request: {
        url: getUrl(`/articles/${params.slug}`),
        method: 'DELETE',
        headers: authHeaderService.getHeader(),
      },
    }).catch((e) => {
      throw handleMutationIssue(e)
    })
  }

  static updateArticleMutation(params: {
    slug: string
    updateArticleDto: UpdateArticleDto
  }) {
    return createJsonMutation({
      request: {
        url: getUrl(`/articles/${params.slug}`),
        method: 'PUT',
        headers: authHeaderService.getHeader(),
        body: JSON.stringify({ article: params.updateArticleDto }),
      },
      response: { contract: ArticleDtoSchema },
    }).catch((e) => {
      throw handleMutationIssue(e)
    })
  }
}
