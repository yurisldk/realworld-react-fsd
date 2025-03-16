import { z } from 'zod';
import { CreateArticleSchema } from './create-article.contract';

export type CreateArticle = z.infer<typeof CreateArticleSchema>;
