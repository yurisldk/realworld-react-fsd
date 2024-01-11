import { useQueryClient } from '@tanstack/react-query';
import { IoTrash } from 'react-icons/io5';
import { useDeleteComment } from '../../api/deleteComment';

type DeleteCommentIconButttonProps = {
  slug: string;
  id: number;
};

export function DeleteCommentIconButtton(props: DeleteCommentIconButttonProps) {
  const { slug, id } = props;

  const queryClient = useQueryClient();

  const { mutate } = useDeleteComment(queryClient);

  const handleClick = () => {
    mutate({ slug, id });
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
