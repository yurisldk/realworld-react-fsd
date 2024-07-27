import { InfiniteData } from '@tanstack/react-query'
import { z } from 'zod'
import {
  ArticleSchema,
  ArticlesSchema,
  FilterQuerySchema,
} from './article.contracts'

export type Article = z.infer<typeof ArticleSchema>
export type Articles = z.infer<typeof ArticlesSchema>
export type FilterQuery = z.infer<typeof FilterQuerySchema>
export type InfiniteArticles = InfiniteData<Articles, number>
