import { IoHeart } from 'react-icons/io5'
import { Button } from '~shared/ui/button'
import { articleTypes } from '~entities/article'
import { useUnfavoriteArticleMutation } from './unfavorite-article.mutation'

type UnfavoriteArticleButtonProps = {
  article: articleTypes.Article
}

export function UnfavoriteArticleBriefButton(
  props: UnfavoriteArticleButtonProps,
) {
  const { article } = props

  const { mutate } = useUnfavoriteArticleMutation({
    mutationKey: ['brief', article.slug],
  })

  const handleUnfavorite = () => {
    const unfavoritedArticle = unfavorite(article)
    mutate(unfavoritedArticle)
  }

  return (
    <Button
      color="primary"
      onClick={handleUnfavorite}
    >
      <IoHeart size={16} />
      {article.favoritesCount}
    </Button>
  )
}

export function UnfavoriteArticleExtendedButton(
  props: UnfavoriteArticleButtonProps,
) {
  const { article } = props

  const { mutate } = useUnfavoriteArticleMutation({
    mutationKey: ['extended', article.slug],
  })

  const handleUnfavorite = () => {
    const unfavoritedArticle = unfavorite(article)
    mutate(unfavoritedArticle)
  }

  return (
    <Button
      color="primary"
      onClick={handleUnfavorite}
    >
      <IoHeart size={16} />
      &nbsp;Unfavorite Article&nbsp;
      <span className="counter">({article.favoritesCount})</span>
    </Button>
  )
}

function unfavorite(article: articleTypes.Article): articleTypes.Article {
  return {
    ...article,
    favorited: false,
    favoritesCount: article.favoritesCount - 1,
  }
}
