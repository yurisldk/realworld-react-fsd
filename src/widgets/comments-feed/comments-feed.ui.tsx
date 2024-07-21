import { ReactNode } from 'react'
import { useSuspenseQuery } from '@tanstack/react-query'
import { withErrorBoundary } from 'react-error-boundary'
import { Link } from 'react-router-dom'
import { compose, withSuspense } from '~shared/lib/react'
import { pathKeys } from '~shared/lib/react-router'
import { PermissionService } from '~shared/session'
import { ErrorHandler, logError } from '~shared/ui/error-handler'
import { CommentQueries, commentTypes } from '~entities/comment'
import { CreateCommentForm, DeleteCommentButtton } from '~features/comment'
import { CommentsListSkeleton } from './comments-feed.skeleton'

export function CommentsFeed(props: { slug: string }) {
  const { slug } = props

  const canCreateComment = PermissionService.useCanPerformAction(
    'create',
    'comment',
  )
  const canReadComment = PermissionService.useCanPerformAction(
    'read',
    'comment',
  )

  return (
    <>
      {!canCreateComment && (
        <p>
          <Link to={pathKeys.login()}>Sign in</Link> or{' '}
          <Link to={pathKeys.register()}>sign up</Link> to add comments on this
          article.
        </p>
      )}
      {canCreateComment && <CreateCommentForm slug={slug} />}
      {canReadComment && <CommentsList slug={slug} />}
    </>
  )
}

type CommentsListProps = { slug: string }

const enhance = compose<CommentsListProps>(
  (component) =>
    withErrorBoundary(component, {
      FallbackComponent: ErrorHandler,
      onError: logError,
    }),
  (component) =>
    withSuspense(component, { FallbackComponent: CommentsListSkeleton }),
)

const CommentsList = enhance((props: CommentsListProps) => {
  const { slug } = props

  const { data } = useSuspenseQuery(CommentQueries.commentsQuery(slug))

  return (
    <div>
      {Array.from(data.values())
        .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
        .map((comment) => (
          <CommentCard
            key={comment.id}
            comment={comment}
            actions={
              <DeleteCommentAction
                slug={slug}
                comment={comment}
              />
            }
          />
        ))}
    </div>
  )
})

function CommentCard(props: {
  comment: commentTypes.Comment
  actions?: ReactNode
}) {
  const { comment, actions } = props
  const { updatedAt } = comment

  const formattedDate = new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(updatedAt)

  return (
    <div
      key={comment.id}
      className="card"
    >
      <div className="card-block">
        <p className="card-text">{comment.body}</p>
      </div>
      <div className="card-footer">
        <Link
          to={pathKeys.profile.byUsername({
            username: comment.author.username,
          })}
          className="comment-author"
        >
          <img
            src={comment.author.image}
            className="comment-author-img"
            alt={comment.author.username}
          />
        </Link>
        &nbsp;
        <Link
          to={pathKeys.profile.byUsername({
            username: comment.author.username,
          })}
          className="comment-author"
        >
          {comment.author.username}
        </Link>
        <span className="date-posted">{formattedDate}</span>
        {actions}
      </div>
    </div>
  )
}

function DeleteCommentAction(props: {
  slug: string
  comment: commentTypes.Comment
}) {
  const { slug, comment } = props
  const { author } = comment

  const canDeleteComment = PermissionService.useCanPerformAction(
    'delete',
    'comment',
    { commentAuthorId: author.username },
  )

  return (
    canDeleteComment && (
      <DeleteCommentButtton
        slug={slug}
        id={comment.id}
      />
    )
  )
}
