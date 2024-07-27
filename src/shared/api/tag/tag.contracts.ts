import { z } from 'zod'

export const TagDtoSchema = z.string()
export const TagsDtoSchema = z.object({
  tags: z.array(TagDtoSchema),
})
