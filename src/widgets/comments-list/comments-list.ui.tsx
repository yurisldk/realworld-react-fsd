import { ReactNode } from 'react';
import { useSuspenseQuery } from '@tanstack/react-query';
import dayjs from 'dayjs';
import { withErrorBoundary } from 'react-error-boundary';
import { Link, useParams } from 'react-router-dom';
import { commentQueries, commentTypes } from '~entities/comment';
import { DeleteCommentIconButtton } from '~features/comment';
import { withSuspense } from '~shared/lib/react';
import { pathKeys, routerTypes } from '~shared/lib/react-router';
import { ErrorHandler } from '~shared/ui/error';
import { Loader } from '~shared/ui/loader';

function List() {
  const { slug } = useParams() as routerTypes.SlugPageParams;

  const { data: comments } = useSuspenseQuery(
    commentQueries.commentsService.queryOptions(slug),
  );

  return (
    <div>
      {comments.map((comment) => (
        <CommentCard
          key={comment.id}
          comment={comment}
          actions={<DeleteCommentIconButtton slug={slug} id={comment.id} />}
        />
      ))}
    </div>
  );
}

type CommentCardProps = {
  comment: commentTypes.Comment;
  actions?: ReactNode;
};

function CommentCard(props: CommentCardProps) {
  const { comment, actions } = props;
  const { createdAt } = comment;

  const formatedDate = dayjs(createdAt).format('MMMM D, YYYY');

  return (
    <div key={comment.id} className="card">
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
        <span className="date-posted">{formatedDate}</span>
        {actions}
      </div>
    </div>
  );
}

const SuspensedCommentsList = withSuspense(List, {
  fallback: <Loader />,
});
export const CommentsList = withErrorBoundary(SuspensedCommentsList, {
  fallbackRender: ({ error }) => <ErrorHandler error={error} />,
});
