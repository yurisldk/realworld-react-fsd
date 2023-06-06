import { CommentCard, commentApi } from '~entities/comment';
import { sessionModel } from '~entities/session';
import { ErrorsList } from '~shared/ui/errors-list';

type CommentsListProps = {
  slug: string;
};

export function CommentsList(props: CommentsListProps) {
  const { slug } = props;

  const isAuth = sessionModel.useAuth();

  const {
    data: comments,
    isLoading,
    isError,
    error,
  } = commentApi.useCommentsQuery(slug, {
    secure: isAuth,
  });

  if (isLoading) return <div>loading</div>;
  if (isError) return <ErrorsList errors={error.error.errors} />;

  return (
    <div>
      {comments.map((comment) => (
        <CommentCard key={comment.id} comment={comment} />
      ))}
    </div>
  );
}
