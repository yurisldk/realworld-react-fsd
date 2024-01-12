import { z } from 'zod';

export const ProfileDtoSchema = z.object({
  profile: z.object({
    username: z.string(),
    bio: z.string(),
    image: z.string(),
    following: z.boolean(),
  }),
});

export const ProfileSchema = z.object({
  username: z.string(),
  bio: z.string(),
  image: z.string(),
  following: z.boolean(),
});
