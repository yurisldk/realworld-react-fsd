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

export const UpdateUserDtoSchema = z
  .object({
    email: z.string().email().optional().or(z.literal('')),
    username: z.string().min(5).optional().or(z.literal('')),
    bio: z.string().optional().or(z.literal('')),
    image: z.string().optional().or(z.literal('')),
    password: z.string().min(8).optional().or(z.literal('')),
  })
  .partial()
  .refine((args) => Object.values(args).some(Boolean), {
    path: ['form'],
    message: 'One of the fields must be defined',
  });

export const CreateUserDtoSchema = z.object({
  username: z.string().min(5),
  email: z.string().email(),
  password: z.string().min(8),
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
