import { CommentCard, commentQueries } from '~entities/comment';
import { DeleteCommentIconButtton } from '~features/comment';
import { ErrorHandler } from '~shared/ui/error';
import { Spinner } from '~shared/ui/spinner';

type CommentsListProps = { slug: string };

export function CommentsList(props: CommentsListProps) {
  const { slug } = props;

  const {
    data: comments,
    isPending,
    isError,
    error,
  } = commentQueries.useCommentsQuery(slug);

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
