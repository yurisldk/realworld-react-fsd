import { z } from 'zod';
// eslint-disable-next-line no-restricted-imports
import { ProfileDtoSchema, ProfileSchema } from '~entities/profile/@x/article';

export const ArticleDtoSchema = z.object({
  slug: z.string(),
  title: z.string(),
  description: z.string(),
  body: z.string(),
  tagList: z.string(),
  createdAt: z.string(),
  updatedAt: z.string(),
  favorited: z.number(),
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
  offset: z.number().min(0).optional(),
  limit: z.number().min(1).optional(),
});

export const ArticlesFeedQueryDtoSchema = z.object({
  offset: z.number().min(0).optional(),
  limit: z.number().min(1).optional(),
});

// {
//   /** Filter by tag */
//   tag?: string;
//   /** Filter by author (username) */
//   author?: string;
//   /** Filter by favorites of a user (username) */
//   favorited?: string;
//   /**
//    * The number of items to skip before starting to collect the result set.
//    * @min 0
//    */
//   offset?: number;
//   /**
//    * The numbers of items to return.
//    * @min 1
//    * @default 20
//    */
//   limit?: number;
// }

export const ArticleResponseSchema = z.object({
  article: ArticleDtoSchema,
});

export const CreateArticleDtoSchema = z.object({
  title: z.string(),
  description: z.string(),
  body: z.string(),
  tagList: z.optional(z.string().array()),
});

export const UpdateArticleDtoSchema = z.object({
  title: z.string().optional(),
  description: z.string().optional(),
  body: z.string().optional(),
});

export const ArticleSchema = z.object({
  slug: z.string(),
  title: z.string(),
  description: z.string(),
  body: z.string(),
  tagList: z.string(),
  createdAt: z.string(),
  updatedAt: z.string(),
  favorited: z.number(),
  favoritesCount: z.number(),
  author: ProfileSchema,
});

export const ArticlesSchema = z.object({
  articles: z.array(ArticleSchema),
  articlesCount: z.number(),
});
