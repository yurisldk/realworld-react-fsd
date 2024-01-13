// eslint-disable-next-line no-restricted-imports
import { mapProfile } from '~entities/profile/@x/article';
import {
  Article,
  ArticleDto,
  Articles,
  ArticlesDto,
  CreateArticle,
  CreateArticleDto,
  UpdateArticle,
  UpdateArticleDto,
} from './article.types';

export function mapArticle(articleDto: ArticleDto): Article {
  return { ...articleDto, author: mapProfile(articleDto.author) };
}

export function mapArticles(articlesDto: ArticlesDto): Articles {
  return articlesDto.articles.map(mapArticle);
}

export function mapCreateDtoArticle(
  createArticle: CreateArticle,
): CreateArticleDto {
  const { tagList, ...article } = createArticle;
  const tags = createArticle?.tagList
    ? createArticle.tagList.split(', ')
    : undefined;

  return {
    ...article,
    tagList: tags,
  };
}

export function mapUpdateDtoArticle(
  updateArticle: UpdateArticle,
): UpdateArticleDto {
  const { tagList, ...article } = updateArticle;
  const tags = updateArticle?.tagList
    ? updateArticle.tagList.split(', ')
    : undefined;

  return {
    ...article,
    tagList: tags,
  };
}

export function mapUpdateArticle(
  updateArticle: UpdateArticleDto,
): UpdateArticle {
  const { tagList, ...article } = updateArticle;
  const tags = updateArticle?.tagList
    ? updateArticle.tagList.join(', ')
    : undefined;

  return {
    ...article,
    tagList: tags,
  };
}
