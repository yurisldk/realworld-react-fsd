import { z } from 'zod';
import {
  ProfileDtoSchema,
  ProfileResponseSchema,
  ProfileSchema,
} from './profie.contracts';

export type ProfileDto = z.infer<typeof ProfileDtoSchema>;
export type ProfileResponse = z.infer<typeof ProfileResponseSchema>;
export type Profile = z.infer<typeof ProfileSchema>;
