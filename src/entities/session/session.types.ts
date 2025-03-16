import { z } from 'zod';
import { UserSchema } from './session.contracts';

export type User = z.infer<typeof UserSchema>;
