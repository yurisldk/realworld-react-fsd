import { z } from 'zod'

export const ProfileDtoSchema = z.object({
  profile: z.object({
    username: z.string(),
    bio: z.string().nullable(),
    image: z.string().nullable(),
    following: z.boolean(),
  }),
})
