import { z } from 'zod';

const userSchema = z.object({
  email: z.string(),
  token: z.string(),
  username: z.string(),
  bio: z.nullable(z.string()),
  image: z.string(),
});

export const UserDtoSchema = z.object({
  user: userSchema,
});

export const UpdateUserDtoSchema = userSchema
  .partial()
  .and(z.object({ password: z.optional(z.string()) }));

export const CreateUserDtoSchema = z.object({
  username: z.string(),
  email: z.string(),
  password: z.string(),
});

export const LoginUserDtoSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

export const UserSchema = z.object({
  email: z.string(),
  token: z.string(),
  username: z.string(),
  bio: z.string(),
  image: z.string(),
});
