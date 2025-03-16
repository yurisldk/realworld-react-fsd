import { z } from 'zod';

export const TagsSchema = z.array(z.string());
