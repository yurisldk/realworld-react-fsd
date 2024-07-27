import { ReactNode } from 'react'
import { useSuspenseQuery } from '@tanstack/react-query'
import { withErrorBoundary } from 'react-error-boundary'
import { IoAdd, IoHeart, IoPencil } from 'react-icons/io5'
import { Link, useLoaderData, useNavigate } from 'react-router-dom'
import { compose, withSuspense } from '~shared/lib/react'
import { pathKeys } from '~shared/lib/react-router'
import { PermissionService } from '~shared/session'
import { Button } from '~shared/ui/button'
import { ErrorHandler, logError } from '~shared/ui/error-handler'
import { ArticleQueries, articleTypes } from '~entities/article'
import { profileTypes } from '~entities/profile'
import {
  DeleteArticleButton,
  FavoriteArticleExtendedButton,
  UnfavoriteArticleExtendedButton,
} from '~features/article'
import { FollowUserButton, UnfollowUserButton } from '~features/profile'
import { CommentsFeed } from '~widgets/comments-feed'
import { ArticleLoaderData } from './article-page.model'
import { ArticlePageSkeleton } from './article-page.skeleton'

const enhance = compose(
  (component) =>
    withErrorBoundary(component, {
      FallbackComponent: ErrorHandler,
      onError: logError,
    }),
  (component) =>
    withSuspense(component, { FallbackComponent: ArticlePageSkeleton }),
)

export const ArticlePage = enhance(() => {
  const { params } = useLoaderData() as ArticleLoaderData

  const { slug } = params

  const { data: article } = useSuspenseQuery(ArticleQueries.articleQuery(slug))

  return (
    <div className="article-page">
      <div className="banner">
        <div className="container">
          <h1>{article.title}</h1>
          <ArticleMeta
            article={article}
            actions={<ArticleActions article={article} />}
          />
        </div>
      </div>

      <div className="container page">
        <div className="row article-content">
          <div className="col-md-12">
            <div>
              <p>{article.body}</p>
            </div>
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
          </div>
        </div>

        <hr />

        <div className="article-actions">
          <ArticleMeta
            article={article}
            actions={<ArticleActions article={article} />}
          />
        </div>

        <div className="row">
          <div className="col-xs-12 col-md-8 offset-md-2">
            <CommentsFeed slug={slug} />
          </div>
        </div>
      </div>
    </div>
  )
})

function ArticleMeta(props: {
  article: articleTypes.Article
  actions?: ReactNode
}) {
  const { article, actions } = props

  const { author, updatedAt } = article

  const formattedDate = new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(updatedAt)

  return (
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
      {actions}
    </div>
  )
}

function ArticleActions(props: { article: articleTypes.Article }) {
  const { article } = props
  const { author } = article
  const { username } = author

  const canUpdateArticle = PermissionService.useCanPerformAction(
    'update',
    'article',
    { articleAuthorId: username },
  )

  const canDeleteArticle = PermissionService.useCanPerformAction(
    'delete',
    'article',
    { articleAuthorId: username },
  )

  return (
    <>
      {canUpdateArticle && <EditArticleLink slug={article.slug} />}
      {!canUpdateArticle && <ToggleFollowProfile profile={author} />}
      &nbsp;
      {canDeleteArticle && <DeleteArticleButton slug={article.slug} />}
      {!canDeleteArticle && <ToggleFavoriteArticle article={article} />}
    </>
  )
}

function ToggleFollowProfile(props: { profile: profileTypes.Profile }) {
  const { profile } = props
  const { following } = profile

  const canFollowProfile = PermissionService.useCanPerformAction(
    'follow',
    'profile',
  )
  const canUnfollowProfile = PermissionService.useCanPerformAction(
    'unfollow',
    'profile',
  )
  const cannotFollowOrUnfollow = !canFollowProfile || !canUnfollowProfile

  const canFollow = canFollowProfile && !following
  const canUnfollow = canUnfollowProfile && following

  return (
    <>
      {canFollow && <FollowUserButton profile={profile} />}
      {canUnfollow && <UnfollowUserButton profile={profile} />}
      {cannotFollowOrUnfollow && (
        <NavigateToLoginButtonFollow username={profile.username} />
      )}
    </>
  )
}

function ToggleFavoriteArticle(props: { article: articleTypes.Article }) {
  const { article } = props
  const { favorited } = article

  const canLikeArticle = PermissionService.useCanPerformAction(
    'like',
    'article',
  )
  const canDislikeArticle = PermissionService.useCanPerformAction(
    'dislike',
    'article',
  )
  const cannotLikeOrDislike = !canLikeArticle || !canDislikeArticle

  const canLike = canLikeArticle && !favorited
  const canDislike = canDislikeArticle && favorited

  return (
    <>
      {canLike && <FavoriteArticleExtendedButton article={article} />}
      {canDislike && <UnfavoriteArticleExtendedButton article={article} />}
      {cannotLikeOrDislike && (
        <NavigateToLoginButtonFavorite
          favoritesCount={article.favoritesCount}
        />
      )}
    </>
  )
}

function EditArticleLink(props: { slug: string }) {
  const { slug } = props

  return (
    <Link
      className="btn btn-outline-secondary btn-sm"
      to={pathKeys.editor.bySlug({ slug })}
    >
      <IoPencil size={16} />
      Edit Article
    </Link>
  )
}

function NavigateToLoginButtonFollow(props: { username: string }) {
  const { username } = props

  const navigate = useNavigate()

  const onClick = () => navigate(pathKeys.login())

  return (
    <Button
      color="secondary"
      variant="outline"
      className="action-btn "
      onClick={onClick}
    >
      <IoAdd size={16} />
      &nbsp; Follow {username}
    </Button>
  )
}

function NavigateToLoginButtonFavorite(props: { favoritesCount: number }) {
  const { favoritesCount } = props

  const navigate = useNavigate()

  const onClick = () => navigate(pathKeys.login())

  return (
    <Button
      color="primary"
      variant="outline"
      onClick={onClick}
    >
      <IoHeart size={16} />
      &nbsp;Favorite Article&nbsp;
      <span className="counter">({favoritesCount})</span>
    </Button>
  )
}
