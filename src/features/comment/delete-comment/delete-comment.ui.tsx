import { IoTrash } from 'react-icons/io5';
import { useDeleteCommentMutation } from './delete-comment.mutation';

type DeleteCommentButttonProps = {
  id: number;
  slug: string;
};

export function DeleteCommentButtton(props: DeleteCommentButttonProps) {
  const { id, slug } = props;

  const { mutate } = useDeleteCommentMutation({ mutationKey: [`${id} ${slug}`] });

  const handleClick = () => {
    mutate({ slug, id });
  };

  return (
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
