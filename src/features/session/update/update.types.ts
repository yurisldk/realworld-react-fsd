import { z } from 'zod';
import { UpdateUserSchema } from './update.contracts';

export type UpdateUser = z.infer<typeof UpdateUserSchema>;
