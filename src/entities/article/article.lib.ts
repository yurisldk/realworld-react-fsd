import { articleTypesDto } from '~shared/api/article'
import {Article, ArticlePreview, Articles} from './article.types'

export function transformArticleDtoToArticle(
  articleDto: articleTypesDto.ArticleDto,
): Article {
  const { article } = articleDto

  return {
    ...article,
    tagList: article.tagList.filter(Boolean),
    author: { ...article.author, bio: article.author.bio || '' },
  }
}

export function transformArticlePreviewDtoToArticlePreview(
    articlePreviewDto: articleTypesDto.ArticlePreviewDto,
): ArticlePreview {
  const { articlePreview } = articlePreviewDto

  return {
    ...articlePreview,
    tagList: articlePreview.tagList.filter(Boolean),
    author: { ...articlePreview.author, bio: articlePreview.author.bio || '' },
  }
}

export function transformArticlesDtoToArticles(
  articlesDto: articleTypesDto.ArticlesDto,
): Articles {
  const { articles } = articlesDto

  return new Map(
    articles.map((articlePreview) => [
      articlePreview.slug,
      transformArticlePreviewDtoToArticlePreview({ articlePreview }),
    ]),
  )
}
