import type { ArticleDto, ArticlesDto, FilterQueryDto } from '~shared/api/api.types';
import type { Article, Articles, FilterQuery } from './article.types';

export function transformArticleDtoToArticle(articleDto: ArticleDto): Article {
  const { article } = articleDto;

  return {
    ...article,
    tagList: article.tagList.filter(Boolean),
    author: {
      ...article.author,
      image: article.author?.image || '',
      bio: article.author?.bio || '',
    },
  };
}

export function transformArticlesDtoToArticles(articlesDto: ArticlesDto): Articles {
  const { articles, articlesCount } = articlesDto;

  return {
    articles: Object.fromEntries(articles.map((article) => [article.slug, transformArticleDtoToArticle({ article })])),
    articlesCount,
  };
}

export function transformFilterQueryToFilterQueryDto(filterQuery: FilterQuery): FilterQueryDto {
  const { page, source, ...otherParams } = filterQuery;
  const limit = 10;
  const offset = (Number(page) - 1) * limit;

  return {
    ...otherParams,
    offset,
    limit,
  };
}
