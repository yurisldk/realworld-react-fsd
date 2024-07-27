import { z } from 'zod'
import { TagsSchema } from './tag.contracts'

export type Tags = z.infer<typeof TagsSchema>
