import { z } from 'zod';

export const TagDtoSchema = z.string();
export const TagsDtoSchema = z.object({
  tags: z.array(TagDtoSchema),
});

export const TagSchema = z.string();
export const TagsSchema = z.array(TagSchema);
