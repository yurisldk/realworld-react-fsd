import { z } from 'zod'
import {
  ArticleDtoSchema,
  ArticlesDtoSchema,
  ArticlesFeedParamsDtoSchema,
  ArticlesParamsDtoSchema,
  CreateArticleDtoSchema,
  FilterParamsDtoSchema,
  PageParamsDtoSchema,
  UpdateArticleDtoSchema,
} from './article.contracts'

export type ArticleDto = z.infer<typeof ArticleDtoSchema>
export type ArticlesDto = z.infer<typeof ArticlesDtoSchema>
export type PageParamsDto = z.infer<typeof PageParamsDtoSchema>
export type FilterParamsDto = z.infer<typeof FilterParamsDtoSchema>
export type ArticlesParamsDto = z.infer<typeof ArticlesParamsDtoSchema>
export type ArticlesParamsQueryDto = z.infer<typeof ArticlesFeedParamsDtoSchema>
export type CreateArticleDto = z.infer<typeof CreateArticleDtoSchema>
export type UpdateArticleDto = z.infer<typeof UpdateArticleDtoSchema>
