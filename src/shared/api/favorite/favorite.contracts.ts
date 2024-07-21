import { z } from 'zod'

const FavoriteArticleDto = z.object({
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
    bio: z.nullable(z.string()),
    image: z.string(),
    following: z.boolean(),
  }),
})

export const FavoriteArticleDtoSchema = z.object({
  article: FavoriteArticleDto,
})
