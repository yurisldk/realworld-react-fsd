import { articleTypesDto } from '~shared/api/article'
import { articleTypes } from '~entities/article'
import { UpdateArticle } from './update-article.contract'

export function transformArticleToUpdateArticleDto(
  article: articleTypes.Article,
): articleTypesDto.UpdateArticleDto {
  return {
    title: article.title,
    description: article.description,
    body: article.body,
    tagList: article.tagList,
  }
}

export function transformArticleToUpdateArticle(
  article: articleTypes.Article,
): UpdateArticle {
  return {
    title: article.title,
    description: article.description,
    body: article.body,
    tagList: article.tagList.join(', '),
  }
}
