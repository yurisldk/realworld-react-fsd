import { IoHeart } from 'react-icons/io5'
import { Button } from '~shared/ui/button'
import { articleTypes } from '~entities/article'
import { useUnfavoriteArticlePreviewMutation } from './unfavorite-article-preview.mutation'
import { useUnfavoriteArticleMutation } from './unfavorite-article.mutation'

type UnfavoriteArticleButtonProps = {
  article: articleTypes.Article
}

type UnfavoriteArticlePreviewButtonProps = {
  article: articleTypes.ArticlePreview
}

export function UnfavoriteArticleBriefButton(
  props: UnfavoriteArticlePreviewButtonProps,
) {
  const { article } = props

  const { mutate } = useUnfavoriteArticlePreviewMutation({
    mutationKey: ['brief', article.slug],
  })

  function unfavorite(articleToUnfavorite: articleTypes.ArticlePreview): articleTypes.ArticlePreview {
    return {
      ...articleToUnfavorite,
      favorited: false,
      favoritesCount: articleToUnfavorite.favoritesCount - 1,
    }
  }

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

  function unfavorite(articleToUnfavorite: articleTypes.Article): articleTypes.Article {
    return {
      ...articleToUnfavorite,
      favorited: false,
      favoritesCount: articleToUnfavorite.favoritesCount - 1,
    }
  }

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
