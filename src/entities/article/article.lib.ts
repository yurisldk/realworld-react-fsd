import { articleTypesDto } from '~shared/api/article'
import type { Article, Articles } from './article.types'

export function transformArticleDtoToArticle(
  articleDto: articleTypesDto.ArticleDto,
): Article {
  const { article } = articleDto

  return {
    ...article,
    tagList: article.tagList.filter(Boolean),
    author: {
      ...article.author,
      image: article.author?.image || '',
      bio: article.author?.bio || '',
    },
  }
}

export function transformArticlesDtoToArticles(
  articlesDto: articleTypesDto.ArticlesDto,
): Articles {
  const { articles } = articlesDto

  return new Map(
    articles.map((article) => [
      article.slug,
      transformArticleDtoToArticle({ article }),
    ]),
  )
}
