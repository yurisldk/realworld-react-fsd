import { IoHeart } from 'react-icons/io5'
import { Button } from '~shared/ui/button'
import { articleTypes } from '~entities/article'
import { useFavoriteArticleMutation } from './favorite-article.mutation'

type FavoriteArticleButtonProps = {
  article: articleTypes.Article
}

export function FavoriteArticleBriefButton(props: FavoriteArticleButtonProps) {
  const { article } = props

  const { mutate } = useFavoriteArticleMutation({
    mutationKey: ['brief', article.slug],
  })

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

function favorite(article: articleTypes.Article): articleTypes.Article {
  return {
    ...article,
    favorited: true,
    favoritesCount: article.favoritesCount + 1,
  }
}
