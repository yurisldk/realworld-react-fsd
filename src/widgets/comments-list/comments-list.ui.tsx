import { useQuery } from '@tanstack/react-query';
import { useParams } from 'react-router-dom';
import { CommentCard, commentQueries } from '~entities/comment';
import { DeleteCommentIconButtton } from '~features/comment';
import { routerTypes } from '~shared/lib/react-router';
import { ErrorHandler } from '~shared/ui/error';
import { Spinner } from '~shared/ui/spinner';

export function CommentsList() {
  const { slug } = useParams() as routerTypes.SlugPageParams;

  const {
    data: comments,
    isPending,
    isError,
    error,
  } = useQuery(commentQueries.commentsQueryOptions(slug));

  if (isPending) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <Spinner />
      </div>
    );
  }

  if (isError) {
    return <ErrorHandler error={error} />;
  }

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
