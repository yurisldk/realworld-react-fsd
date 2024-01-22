import { useSuspenseQuery } from '@tanstack/react-query';
import { useParams } from 'react-router-dom';
import { CommentCard, commentQueries } from '~entities/comment';
import { DeleteCommentIconButtton } from '~features/comment';
import { routerTypes } from '~shared/lib/react-router';

export function CommentsList() {
  const { slug } = useParams() as routerTypes.SlugPageParams;

  const { data: comments } = useSuspenseQuery(
    commentQueries.commentsQueryOptions(slug),
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
