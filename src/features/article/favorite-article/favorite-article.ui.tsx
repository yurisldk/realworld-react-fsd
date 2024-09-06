import { IoHeart } from 'react-icons/io5'
import { Button } from '~shared/ui/button'
import { articleTypes } from '~entities/article'
import { useFavoriteArticlePreviewMutation } from './favorite-article-preview.mutation'
import { useFavoriteArticleMutation } from './favorite-article.mutation'

type FavoriteArticleButtonProps = {
  article: articleTypes.Article
}

type FavoriteArticlePreviewButtonProps = {
  article: articleTypes.ArticlePreview
}

export function FavoriteArticleBriefButton(props: FavoriteArticlePreviewButtonProps) {
  const { article } = props

  const { mutate } = useFavoriteArticlePreviewMutation({
    mutationKey: ['brief', article.slug],
  })

  function favorite(articleToFavorite: articleTypes.ArticlePreview): articleTypes.ArticlePreview {
    return {
      ...articleToFavorite,
      favorited: true,
      favoritesCount: articleToFavorite.favoritesCount + 1,
    }
  }

  const handleFavorite = () => {
    const favoritedArticle = favorite(article)
    mutate(favoritedArticle)
  }

  return (
    <Button
      color="primary"
      variant="outline"
      onClick={handleFavorite}
    >
      <IoHeart size={16} />
      {article.favoritesCount}
    </Button>
  )
}

export function FavoriteArticleExtendedButton(
  props: FavoriteArticleButtonProps,
) {
  const { article } = props

  const { mutate } = useFavoriteArticleMutation({
    mutationKey: ['extended', article.slug],
  })

  function favorite(articleToFavorite: articleTypes.Article): articleTypes.Article {
    return {
      ...articleToFavorite,
      favorited: true,
      favoritesCount: articleToFavorite.favoritesCount + 1,
    }
  }

  const handleFavorite = () => {
    const favoritedArticle = favorite(article)
    mutate(favoritedArticle)
  }

  return (
    <Button
      color="primary"
      variant="outline"
      onClick={handleFavorite}
    >
      <IoHeart size={16} />
      &nbsp;Favorite Article&nbsp;
      <span className="counter">({article.favoritesCount})</span>
    </Button>
  )
}

