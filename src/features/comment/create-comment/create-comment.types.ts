import { z } from 'zod';
import { CreateCommentSchema } from './create-comment.contracts';

export type CreateComment = z.infer<typeof CreateCommentSchema>;
