import { z } from 'zod';

export const UpdateUserSchema = z
  .object({
    email: z.string().email().optional().or(z.literal('')),
    username: z.string().min(5).optional().or(z.literal('')),
    bio: z.string().optional().or(z.literal('')),
    image: z.string().optional().or(z.literal('')),
    password: z.string().min(8).optional().or(z.literal('')),
  })
  .partial()
  .refine((args) => Object.values(args).some(Boolean), {
    path: ['root'],
    message: 'One of the fields must be defined',
  });
