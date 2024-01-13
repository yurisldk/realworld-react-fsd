import { z } from 'zod';

export const ProfileDtoSchema = z.object({
  username: z.string(),
  bio: z.nullable(z.string()),
  image: z.string(),
  following: z.boolean(),
});

export const ProfileResponseSchema = z.object({
  profile: ProfileDtoSchema,
});

export const ProfileSchema = z.object({
  username: z.string(),
  bio: z.string(),
  image: z.string(),
  following: z.boolean(),
});
