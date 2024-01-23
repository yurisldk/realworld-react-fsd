import { IoTrash } from 'react-icons/io5';
import { commentQueries } from '~entities/comment';

type DeleteCommentIconButttonProps = {
  slug: string;
  id: number;
};

export function DeleteCommentIconButtton(props: DeleteCommentIconButttonProps) {
  const { slug, id } = props;

  const { mutate: deleteComment } =
    commentQueries.useDeleteCommentMutation(slug);

  const handleClick = () => {
    deleteComment({ slug, id: `${id}` });
  };

  return (
    // eslint-disable-next-line jsx-a11y/control-has-associated-label
    <button
      style={{ border: 0, backgroundColor: 'transparent' }}
      className="mod-options"
      onClick={handleClick}
      type="button"
    >
      <span>
        <IoTrash size={14} />
      </span>
    </button>
  );
}
