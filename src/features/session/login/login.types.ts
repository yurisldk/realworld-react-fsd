import { z } from 'zod';
import { LoginUserSchema } from './login.contracts';

export type LoginUser = z.infer<typeof LoginUserSchema>;
