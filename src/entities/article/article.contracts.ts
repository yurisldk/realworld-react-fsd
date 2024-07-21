import { z } from 'zod'

export const FilterQuerySchema = z.object({
  offset: z.number().min(0),
  limit: z.number().min(1),
  tag: z.string().nullable(),
  author: z.string().nullable(),
  favorited: z.string().nullable(),
})

export const ArticleSchema = z.object({
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
    bio: z.string(),
    image: z.string(),
    following: z.boolean(),
  }),
})

export const ArticlesSchema = z.map(z.string(), ArticleSchema)
