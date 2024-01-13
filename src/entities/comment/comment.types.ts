import { z } from 'zod';
import {
  CommentDtoSchema,
  CommentSchema,
  CommentsDtoSchema,
  CommentsSchema,
  CreateCommentDtoSchema,
} from './comment.contracts';

export type CommentDto = z.infer<typeof CommentDtoSchema>;
export type CommentsDto = z.infer<typeof CommentsDtoSchema>;
export type CreateCommentDto = z.infer<typeof CreateCommentDtoSchema>;

export type Comment = z.infer<typeof CommentSchema>;
export type Comments = z.infer<typeof CommentsSchema>;
