import { z } from 'zod'

export const ProfileDtoSchema = z.object({
  profile: z.object({
    username: z.string(),
    bio: z.nullable(z.string()),
    image: z.string(),
    following: z.boolean(),
  }),
})
