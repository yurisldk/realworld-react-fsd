import type { UpdateArticleDto } from '~shared/api/api.types';
import type { Article } from '~entities/article/article.types';
import type { UpdateArticle } from './update-article.types';

export function transformUpdateArticleToUpdateArticleDto(updateArticle: UpdateArticle): UpdateArticleDto {
  return {
    article: {
      title: updateArticle.title,
      description: updateArticle.description,
      body: updateArticle.body,
      tagList: updateArticle.tagList?.split(', ').filter(Boolean),
    },
  };
}

export function transformArticleToUpdateArticle(article: Article): UpdateArticle {
  return {
    slug: article.slug,
    title: article.title,
    description: article.description,
    body: article.body,
    tagList: article.tagList.join(', '),
  };
}
