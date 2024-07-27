import { z } from 'zod'

const CommentDto = z.object({
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

export const CommentDtoSchema = z.object({
  comment: CommentDto,
})

export const CommentsDtoSchema = z.object({
  comments: z.array(CommentDto),
})

export const CreateCommentDtoSchema = z.object({
  body: z.string().min(1, {
    message: 'The comment body must contain at least 1 character.',
  }),
})
