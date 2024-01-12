// eslint-disable-next-line no-restricted-imports
import { mapProfile } from '~entities/profile/@x/article';
import { Article, ArticleDto, Articles, ArticlesDto } from './article.types';

export function mapArticle(articleDto: ArticleDto): Article {
  return { ...articleDto, author: mapProfile(articleDto.author) };
}

export function mapArticles(articlesDto: ArticlesDto): Articles {
  return {
    articles: articlesDto.articles.map(mapArticle),
    articlesCount: articlesDto.articlesCount,
  };
}
