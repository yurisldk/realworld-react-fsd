import { z } from 'zod';

export const LoginUserSchema = z.object({
  email: z.string().email({
    message:
      'Oops! The email address you entered is invalid. Please double-check and make sure it follows the format: example@domain.com',
  }),
  password: z.string().min(8, {
    message: 'Your password must be at least 8 characters long. Please try again.',
  }),
});
