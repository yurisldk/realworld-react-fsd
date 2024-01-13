import { z } from 'zod';
// eslint-disable-next-line no-restricted-imports
import { ProfileDtoSchema, ProfileSchema } from '~entities/profile/@x/article';

export const ArticleDtoSchema = z.object({
  slug: z.string(),
  title: z.string(),
  description: z.string(),
  body: z.string(),
  tagList: z.string().array(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
  favorited: z.boolean(),
  favoritesCount: z.number(),
  author: ProfileDtoSchema,
});

export const ArticlesDtoSchema = z.object({
  articles: z.array(ArticleDtoSchema),
  articlesCount: z.number(),
});

export const ArticlesQueryDtoSchema = z.object({
  tag: z.string().optional(),
  author: z.string().optional(),
  favorited: z.string().optional(),
  offset: z.number().min(0),
  limit: z.number().min(1),
});

export const ArticlesFeedQueryDtoSchema = z.object({
  offset: z.number().min(0),
  limit: z.number().min(1),
});

export const ArticleResponseSchema = z.object({
  article: ArticleDtoSchema,
});

export const CreateArticleDtoSchema = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
  body: z.string().min(1),
  tagList: z.optional(z.string().array()),
});

export const CreateArticleSchema = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
  body: z.string().min(1),
  tagList: z.string().min(1).optional().or(z.literal('')),
});

export const UpdateArticleDtoSchema = z.object({
  title: z.string().optional(),
  description: z.string().optional(),
  body: z.string().optional(),
  tagList: z.optional(z.string().array()),
});

export const UpdateArticleSchema = z
  .object({
    title: z.string().optional().or(z.literal('')),
    description: z.string().optional().or(z.literal('')),
    body: z.string().optional().or(z.literal('')),
    tagList: z.string().optional().or(z.literal('')),
  })
  .partial()
  .refine((args) => Object.values(args).some(Boolean), {
    path: ['form'],
    message: 'One of the fields must be defined',
  });

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
  author: ProfileSchema,
});

export const ArticlesSchema = z.array(ArticleSchema);

export const EmptySchema = z.object({});
