import { z } from 'zod'
import {
  ArticleDtoSchema,
  ArticlesDtoSchema,
  ArticlesFeedQueryDtoSchema,
  ArticlesQueryDtoSchema,
  CreateArticleDtoSchema,
  FilterQueryDtoSchema,
  PageQueryDtoSchema,
  UpdateArticleDtoSchema,
} from './article.contracts'

export type ArticleDto = z.infer<typeof ArticleDtoSchema>
export type ArticlesDto = z.infer<typeof ArticlesDtoSchema>
export type PageQueryDto = z.infer<typeof PageQueryDtoSchema>
export type FilterQueryDto = z.infer<typeof FilterQueryDtoSchema>
export type ArticlesQueryDto = z.infer<typeof ArticlesQueryDtoSchema>
export type ArticlesFeedQueryDto = z.infer<typeof ArticlesFeedQueryDtoSchema>
export type CreateArticleDto = z.infer<typeof CreateArticleDtoSchema>
export type UpdateArticleDto = z.infer<typeof UpdateArticleDtoSchema>
