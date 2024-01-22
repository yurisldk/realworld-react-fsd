import { z } from 'zod';

export const SlugPageParamsSchema = z.object({ slug: z.string() });
export const UsernamePageParamsSchema = z.object({ username: z.string() });
