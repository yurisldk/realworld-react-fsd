import { ReactNode } from 'react'
import { useSuspenseInfiniteQuery } from '@tanstack/react-query'
import { withErrorBoundary } from 'react-error-boundary'
import { IoHeart } from 'react-icons/io5'
import { Link, useNavigate } from 'react-router-dom'
import { compose, withSuspense } from '~shared/lib/react'
import { pathKeys } from '~shared/lib/react-router'
import { PermissionService } from '~shared/session'
import { Button } from '~shared/ui/button'
import { ErrorHandler, logError } from '~shared/ui/error-handler'
import { ArticleQueries, articleTypes } from '~entities/article'
import {
  FavoriteArticleBriefButton,
  UnfavoriteArticleBriefButton,
  filterArticleModel,
} from '~features/article'
import { ArticlesFeedSkeleton } from './articles-feed.skeleton'

type ArticlesFeedProps = {
  useArticleFilterStore?: filterArticleModel.ArticleFilterStore
  articlesInfiniteQueryOptions: typeof ArticleQueries.articlesInfiniteQuery
}

const enhance = compose<ArticlesFeedProps>(
  (component) =>
    withErrorBoundary(component, {
      FallbackComponent: ErrorHandler,
      onError: logError,
    }),
  (component) =>
    withSuspense(component, { FallbackComponent: ArticlesFeedSkeleton }),
)

export const ArticlesFeed = enhance((props: ArticlesFeedProps) => {
  const { useArticleFilterStore, articlesInfiniteQueryOptions } = props

  const articleFilter = useArticleFilterStore?.()

  const {
    data: articles,
    isPending,
    isSuccess,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useSuspenseInfiniteQuery(articlesInfiniteQueryOptions(articleFilter))

  const isEmpty =
    isSuccess &&
    !hasNextPage &&
    articles.pages.length === 1 &&
    articles.pages[0].size === 0

  const canShowNextPageButton = hasNextPage && !isFetchingNextPage
  const canShowLoadingPageButton = hasNextPage && isFetchingNextPage

  return (
    <>
      {isPending && <ArticlePreview>Loading articles...</ArticlePreview>}

      {isEmpty && <ArticlePreview>No articles are here... yet.</ArticlePreview>}

      {isSuccess &&
        articles.pages.map((page) =>
          Array.from(page.values()).map((article) => (
            <ArticleMeta
              key={article.slug}
              article={article}
              action={<FavoriteArticleAction article={article} />}
            />
          )),
        )}

      {canShowNextPageButton && <NextPageButton onClick={fetchNextPage} />}

      {canShowLoadingPageButton && <LoadingPageButton />}
    </>
  )
})

type ArticleMetaProps = { article: articleTypes.ArticlePreview; action?: ReactNode }
function ArticleMeta(props: ArticleMetaProps) {
  const { article, action } = props
  const { author, createdAt } = article

  const formattedDate = new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(createdAt)

  return (
    <div className="article-preview">
      <div className="article-meta">
        <Link to={pathKeys.profile.byUsername({ username: author.username })}>
          <img
            src={author.image}
            alt={author.username}
          />
        </Link>

        <div className="info">
          <Link
            className="author"
            to={pathKeys.profile.byUsername({ username: author.username })}
          >
            {author.username}
          </Link>

          <span className="date">{formattedDate}</span>
        </div>

        {action}
      </div>

      <Link
        className="preview-link"
        to={pathKeys.article.bySlug({ slug: article.slug })}
      >
        <h1>{article.title}</h1>
        <p>{article.description}</p>
        <span>Read more...</span>
        <ul className="tag-list">
          {article.tagList.map((tag) => (
            <li
              key={tag}
              className="tag-default tag-pill tag-outline"
            >
              {tag}
            </li>
          ))}
        </ul>
      </Link>
    </div>
  )
}

function ArticlePreview(props: { children: ReactNode }) {
  return <div className="article-preview">{props.children}</div>
}

function NextPageButton(props: { onClick: VoidFunction }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'center' }}>
      <Button
        color="primary"
        variant="outline"
        onClick={props.onClick}
      >
        Load More
      </Button>
    </div>
  )
}

function LoadingPageButton() {
  return (
    <div style={{ display: 'flex', justifyContent: 'center' }}>
      <Button
        color="primary"
        variant="outline"
        disabled
      >
        Loading more...
      </Button>
    </div>
  )
}

function FavoriteArticleAction(props: { article: articleTypes.ArticlePreview }) {
  const { article } = props

  const canLike = PermissionService.useCanPerformAction('like', 'article')
  const canDislike = PermissionService.useCanPerformAction('dislike', 'article')
  const canLikeArticle = canLike && !article.favorited
  const canDislikeArticle = canDislike && article.favorited
  const cannotLikeAndDislikeArticle = !canLike && !canDislike

  return (
    <>
      {canLikeArticle && (
        <div className="pull-xs-right">
          <FavoriteArticleBriefButton article={article} />
        </div>
      )}

      {canDislikeArticle && (
        <div className="pull-xs-right">
          <UnfavoriteArticleBriefButton article={article} />
        </div>
      )}

      {cannotLikeAndDislikeArticle && (
        <div className="pull-xs-right">
          <NavigateToLoginButton favoritesCount={article.favoritesCount} />
        </div>
      )}
    </>
  )
}

function NavigateToLoginButton(props: { favoritesCount: number }) {
  const { favoritesCount } = props

  const navigate = useNavigate()

  const onClick = () => navigate(pathKeys.login())

  return (
    <Button
      color="primary"
      variant="outline"
      onClick={onClick}
    >
      <IoHeart size={16} /> {Boolean(favoritesCount) && favoritesCount}
    </Button>
  )
}
