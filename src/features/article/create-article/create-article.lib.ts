import type { CreateArticleDto } from '~shared/api/api.types';
import type { CreateArticle } from './create-article.types';

export function transformCreateArticleToCreateArticleDto(createArticle: CreateArticle): CreateArticleDto {
  return {
    article: {
      title: createArticle.title,
      description: createArticle.description,
      body: createArticle.body,
      tagList: createArticle.tagList?.split(', ').filter(Boolean),
    },
  };
}
