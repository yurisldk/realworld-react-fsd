import { z } from 'zod'

export const UpdateArticleSchema = z.object({
  title: z.string().optional(),
  description: z.string().optional(),
  body: z.string().optional(),
  tagList: z.string().optional(),
})
export type UpdateArticle = z.infer<typeof UpdateArticleSchema>
