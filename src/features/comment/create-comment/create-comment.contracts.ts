import { z } from 'zod';

export const CreateCommentSchema = z.object({
  slug: z.string(),
  body: z.string().min(1, {
    message: 'The comment body must contain at least 1 character.',
  }),
});
