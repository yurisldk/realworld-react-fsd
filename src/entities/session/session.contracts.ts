import { z } from 'zod';

export const UserDtoSchema = z.object({
  user: z.object({
    email: z.string(),
    token: z.string(),
    username: z.string(),
    bio: z.nullable(z.string()),
    image: z.string(),
  }),
});

// export const

export const UpdateUserDtoSchema = UserDtoSchema.partial().and(
  z.object({ password: z.optional(z.string()) }),
);

export const CreateUserDtoSchema = z.object({
  username: z.string(),
  email: z.string(),
  password: z.string(),
});

export const LoginUserDtoSchema = z.object({
  email: z.string(),
  password: z.string(),
});

export const UserSchema = z.object({
  email: z.string(),
  token: z.string(),
  username: z.string(),
  bio: z.nullable(z.string()),
  image: z.string(),
});
