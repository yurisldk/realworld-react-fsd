import { z } from 'zod';

export const ArticleSchema = z.object({
  slug: z.string(),
  title: z.string(),
  description: z.string(),
  body: z.string(),
  tagList: z.string().array(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
  favorited: z.boolean(),
  favoritesCount: z.number(),
  author: z.object({
    username: z.string(),
    bio: z.string(),
    image: z.string(),
    following: z.boolean(),
  }),
});

export const ArticlesSchema = z.object({
  articles: z.record(z.string(), ArticleSchema),
  articlesCount: z.number(),
});

export const FilterQuerySchema = z.object({
  page: z.coerce.string().refine((val) => !Number.isNaN(Number(val)) && Number(val) > 0, {
    message: 'Page must be a positive number',
  }),
  source: z.enum(['user', 'global']),
  tag: z.string().optional(),
  author: z.string().optional(),
  favorited: z.string().optional(),
});
