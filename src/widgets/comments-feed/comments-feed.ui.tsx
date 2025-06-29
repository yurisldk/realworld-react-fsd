import { ReactNode, Suspense } from 'react';
import { useSuspenseQuery } from '@tanstack/react-query';
import { ErrorBoundary } from 'react-error-boundary';
import { Link } from 'react-router-dom';
import { pathKeys } from '~shared/router';
import { logError } from '~shared/ui/error-handler/error-handler.lib';
import { ErrorHandler } from '~shared/ui/error-handler/error-handler.ui';
import { commentsQueryOptions } from '~entities/comment/comment.api';
import { Comment } from '~entities/comment/comment.types';
import { CreateCommentForm } from '~features/comment/create-comment/create-comment.ui';
import { DeleteCommentButtton } from '~features/comment/delete-comment/delete-comment.ui';
import { useCanPerformAction } from '~features/permission/permission.service';
import { CommentsListSkeleton } from './comments-feed.skeleton';

export function CommentsFeed(props: { slug: string }) {
  const { slug } = props;

  const canCreateComment = useCanPerformAction('create', 'comment');

  return (
    <>
      {!canCreateComment && (
        <p>
          <Link to={pathKeys.login}>Sign in</Link> or <Link to={pathKeys.register}>sign up</Link> to add comments on
          this article.
        </p>
      )}
      {canCreateComment && <CreateCommentForm slug={slug} />}
      <CommentsList slug={slug} />
    </>
  );
}

type CommentsListProps = { slug: string };

function CommentsList(props: CommentsListProps) {
  return (
    <ErrorBoundary FallbackComponent={ErrorHandler} onError={logError}>
      <Suspense fallback={<CommentsListSkeleton />}>
        <BaseCommentsList {...props} />
      </Suspense>
    </ErrorBoundary>
  );
}

function BaseCommentsList(props: CommentsListProps) {
  const { slug } = props;

  const { data } = useSuspenseQuery(commentsQueryOptions(slug));

  return (
    <div data-test="comments">
      {Array.from(data.values())
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        .map((comment) => (
          <CommentCard
            key={comment.id}
            comment={comment}
            actions={<DeleteCommentAction slug={slug} comment={comment} />}
          />
        ))}
    </div>
  );
}

function CommentCard(props: { comment: Comment; actions?: ReactNode }) {
  const { comment, actions } = props;
  const { updatedAt } = comment;

  const formattedDate = new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(new Date(updatedAt));

  return (
    <div key={comment.id} className="card" data-test="comment-item">
      <div className="card-block">
        <p className="card-text">{comment.body}</p>
      </div>
      <div className="card-footer">
        <Link to={pathKeys.profile.byUsername(comment.author.username)} className="comment-author">
          <img src={comment.author.image} className="comment-author-img" alt={comment.author.username} />
        </Link>
        &nbsp;
        <Link to={pathKeys.profile.byUsername(comment.author.username)} className="comment-author">
          {comment.author.username}
        </Link>
        <span className="date-posted">{formattedDate}</span>
        {actions}
      </div>
    </div>
  );
}

function DeleteCommentAction(props: { slug: string; comment: Comment }) {
  const { slug, comment } = props;
  const { author } = comment;

  const canDeleteComment = useCanPerformAction('delete', 'comment', {
    commentAuthorId: author.username,
  });

  return canDeleteComment && <DeleteCommentButtton slug={slug} id={comment.id} />;
}
