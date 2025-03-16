import { z } from 'zod';
import { UpdateArticleSchema } from './update-article.contract';

export type UpdateArticle = z.infer<typeof UpdateArticleSchema>;
