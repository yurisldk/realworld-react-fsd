import { z } from 'zod';
import { ProfileDtoSchema, ProfileSchema } from './profie.contracts';

export type ProfileDto = z.infer<typeof ProfileDtoSchema>;
export type Profile = z.infer<typeof ProfileSchema>;
