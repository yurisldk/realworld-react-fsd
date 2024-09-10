import { IoHeart } from 'react-icons/io5'
import { Button } from '~shared/ui/button'
import { articleTypes } from '~entities/article'
import { useFavoriteArticleMutation } from './favorite-article.mutation'

export function FavoriteArticleBriefButton(props: {
  article: articleTypes.ArticlePreview
}) {
  const { article } = props

  const { mutate } = useFavoriteArticleMutation({
    mutationKey: ['brief', article.slug],
  })

  const handleFavorite = () => {
    mutate(article.slug)
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

export function FavoriteArticleExtendedButton(props: {
  article: articleTypes.Article
}) {
  const { article } = props

  const { mutate } = useFavoriteArticleMutation({
    mutationKey: ['extended', article.slug],
  })

  const handleFavorite = () => {
    mutate(article.slug)
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
