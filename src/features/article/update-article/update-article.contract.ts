import { z } from 'zod';

export const UpdateArticleSchema = z.object({
  slug: z.string(),
  title: z.string().optional(),
  description: z.string().optional(),
  body: z.string().optional(),
  tagList: z.string().optional(),
});
