import { AxiosContracts } from '~shared/lib/axios'
import { realworld } from '../index'
import {
  ArticleDtoSchema,
  ArticlesDtoSchema,
  CreateArticleDtoSchema,
  UpdateArticleDtoSchema,
} from './article.contracts'
import {
  ArticlesParamsDto,
  ArticlesParamsQueryDto,
  CreateArticleDto,
  UpdateArticleDto,
} from './article.types'

export class ArticleService {
  static articlesQuery(config: {
    params: ArticlesParamsDto
    signal?: AbortSignal
  }) {
    return realworld
      .get('/articles', config)
      .then(AxiosContracts.responseContract(ArticlesDtoSchema))
  }

  static articlesFeedQuery(config: {
    params: ArticlesParamsQueryDto
    signal?: AbortSignal
  }) {
    return realworld
      .get('/articles/feed', config)
      .then(AxiosContracts.responseContract(ArticlesDtoSchema))
  }

  static articleQuery(slug: string, config: { signal?: AbortSignal }) {
    return realworld
      .get(`/articles/${slug}`, config)
      .then(AxiosContracts.responseContract(ArticleDtoSchema))
  }

  static createArticleMutation(data: { createArticleDto: CreateArticleDto }) {
    const createArticleDto = AxiosContracts.requestContract(
      CreateArticleDtoSchema,
      data.createArticleDto,
    )
    return realworld
      .post('/articles', { article: createArticleDto })
      .then(AxiosContracts.responseContract(ArticleDtoSchema))
  }

  static deleteArticleMutation(slug: string) {
    return realworld.delete(`/articles/${slug}`)
  }

  static updateArticleMutation(
    slug: string,
    data: { updateArticleDto: UpdateArticleDto },
  ) {
    const updateArticleDto = AxiosContracts.requestContract(
      UpdateArticleDtoSchema,
      data.updateArticleDto,
    )
    return realworld
      .put(`/articles/${slug}`, { article: updateArticleDto })
      .then(AxiosContracts.responseContract(ArticleDtoSchema))
  }
}
