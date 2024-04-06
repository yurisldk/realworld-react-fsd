import { z } from 'zod';
import {
  CommentDtoSchema,
  CommentsDtoSchema,
  CreateCommentDtoSchema,
} from './comment.contracts';

export type CommentDto = z.infer<typeof CommentDtoSchema>;
export type CommentsDto = z.infer<typeof CommentsDtoSchema>;
export type CreateCommentDto = z.infer<typeof CreateCommentDtoSchema>;
