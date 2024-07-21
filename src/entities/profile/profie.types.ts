import { z } from 'zod'
import { ProfileSchema } from './profie.contracts'

export type Profile = z.infer<typeof ProfileSchema>
