import { articleTypesDto } from '~shared/api/article'
import { sessionTypes } from '~shared/session'
import { articleTypes } from '~entities/article'
import { CreateArticle } from './create-article.contract'

export function transformArticleToCreateArticleDto(
  article: articleTypes.Article,
): articleTypesDto.CreateArticleDto {
  return {
    title: article.title,
    description: article.description,
    body: article.body,
    tagList: article.tagList,
  }
}

export function transformCreateArticleToArticle(config: {
  createArticle: CreateArticle
  session: sessionTypes.Session
}): articleTypes.Article {
  const { createArticle, session } = config
  const { username, bio, image } = session

  return {
    ...createArticle,
    slug: createArticle.title.toLowerCase().replaceAll(' ', '-'),
    createdAt: new Date(Date.now()),
    updatedAt: new Date(Date.now()),
    favorited: false,
    favoritesCount: 0,
    author: {
      username,
      following: false,
      bio,
      image,
    },
    tagList: createArticle.tagList?.split(', ').filter(Boolean) || [],
  }
}
