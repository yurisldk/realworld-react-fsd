import { z } from 'zod'

export const CommentSchema = z.object({
  id: z.number(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
  body: z.string(),
  author: z.object({
    username: z.string(),
    bio: z.nullable(z.string()),
    image: z.string(),
    following: z.boolean(),
  }),
})

export const CommentsSchema = z.map(z.number(), CommentSchema)
