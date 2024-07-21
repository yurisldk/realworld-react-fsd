import { z } from 'zod'
import { TagDtoSchema, TagsDtoSchema } from './tag.contracts'

export type TagDto = z.infer<typeof TagDtoSchema>
export type TagsDto = z.infer<typeof TagsDtoSchema>
