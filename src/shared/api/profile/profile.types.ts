import { z } from 'zod';
import { ProfileDtoSchema } from './profile.contracts';

export type ProfileDto = z.infer<typeof ProfileDtoSchema>;
