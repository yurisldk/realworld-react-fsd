import { z } from 'zod';
import { FavoriteArticleDtoSchema } from './favorite.contracts';

export type FavoriteArticleDto = z.infer<typeof FavoriteArticleDtoSchema>;
