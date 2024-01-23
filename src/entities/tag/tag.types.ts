import { z } from 'zod';
import {
  TagDtoSchema,
  TagSchema,
  TagsDtoSchema,
  TagsSchema,
} from './tag.contracts';

export type TagDto = z.infer<typeof TagDtoSchema>;
export type TagsDto = z.infer<typeof TagsDtoSchema>;

export type Tag = z.infer<typeof TagSchema>;
export type Tags = z.infer<typeof TagsSchema>;
