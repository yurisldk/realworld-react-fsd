import { z } from 'zod';
// eslint-disable-next-line no-restricted-imports
import { ProfileDtoSchema } from '~entities/profile/@x/comment';

export const CommentDtoSchema = z.object({
  id: z.number(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
  body: z.string(),
  author: ProfileDtoSchema,
});

export const CommentResponseSchema = z.object({
  comment: CommentDtoSchema,
});

export const CommentsDtoSchema = z.object({
  comments: z.array(CommentDtoSchema),
});

export const CreateCommentDtoSchema = z.object({
  body: z.string(),
});

export const CommentSchema = z.object({
  id: z.number(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
  body: z.string(),
  author: ProfileDtoSchema,
});

export const CommentsSchema = z.array(CommentSchema);

export const EmptySchema = z.object({});
