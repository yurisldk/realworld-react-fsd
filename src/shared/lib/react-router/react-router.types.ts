import { z } from 'zod';
import {
  SlugPageParamsSchema,
  UsernamePageParamsSchema,
} from './react-router.contracts';

export type SlugPageParams = z.infer<typeof SlugPageParamsSchema>;
export type UsernamePageParams = z.infer<typeof UsernamePageParamsSchema>;
