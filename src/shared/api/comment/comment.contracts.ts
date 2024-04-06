import { z } from 'zod';

const CommentDto = z.object({
  id: z.number(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
  body: z.string(),
  author: z.object({
    username: z.string(),
    bio: z.nullable(z.string()),
    image: z.string(),
    following: z.boolean(),
  }),
});

export const CommentDtoSchema = z.object({
  comment: CommentDto,
});

export const CommentsDtoSchema = z.object({
  comments: z.array(CommentDto),
});

export const CreateCommentDtoSchema = z.object({
  body: z.string().min(1),
});

export const EmptySchema = z.object({});
