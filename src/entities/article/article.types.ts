import { z } from 'zod';
import {
  ArticleDtoSchema,
  ArticleSchema,
  ArticlesDtoSchema,
  ArticlesFeedQueryDtoSchema,
  ArticlesQueryDtoSchema,
  ArticlesSchema,
  CreateArticleDtoSchema,
  UpdateArticleDtoSchema,
} from './article.contracts';

export type ArticleDto = z.infer<typeof ArticleDtoSchema>;
export type ArticlesDto = z.infer<typeof ArticlesDtoSchema>;
export type ArticlesQueryDto = z.infer<typeof ArticlesQueryDtoSchema>;
export type ArticlesFeedQueryDto = z.infer<typeof ArticlesFeedQueryDtoSchema>;
export type CreateArticleDto = z.infer<typeof CreateArticleDtoSchema>;
export type UpdateArticleDto = z.infer<typeof UpdateArticleDtoSchema>;

export type Article = z.infer<typeof ArticleSchema>;
export type Articles = z.infer<typeof ArticlesSchema>;
