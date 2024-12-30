import { z } from 'zod'

const ArticleDto = z.object({
  slug: z.string(),
  title: z.string(),
  description: z.string(),
  body: z.string(),
  tagList: z.string().array(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
  favorited: z.boolean(),
  favoritesCount: z.number(),
  author: z.object({
    username: z.string(),
    bio: z.string().nullable(),
    image: z.string().nullable(),
    following: z.boolean(),
  }),
})

export const ArticlesDtoSchema = z.object({
  articles: z.array(ArticleDto),
  articlesCount: z.number(),
})

export const PageParamsDtoSchema = z.object({
  offset: z.number().min(0),
  limit: z.number().min(1),
})

export const FilterParamsDtoSchema = z.object({
  tag: z.string().optional(),
  author: z.string().optional(),
  favorited: z.string().optional(),
})

export const ArticlesParamsDtoSchema = z.intersection(
  PageParamsDtoSchema,
  FilterParamsDtoSchema,
)

export const ArticlesFeedParamsDtoSchema = z.object({
  offset: z.number().min(0),
  limit: z.number().min(1),
})

export const ArticleDtoSchema = z.object({
  article: ArticleDto,
})

export const CreateArticleDtoSchema = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
  body: z.string().min(1),
  tagList: z.optional(z.string().array()),
})

export const UpdateArticleDtoSchema = z.object({
  title: z.string().optional(),
  description: z.string().optional(),
  body: z.string().optional(),
  tagList: z.optional(z.string().array()),
})
