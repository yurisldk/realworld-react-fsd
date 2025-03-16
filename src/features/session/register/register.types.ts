import { z } from 'zod';
import { RegisterUserSchema } from './register.contracts';

export type RegisterUser = z.infer<typeof RegisterUserSchema>;
