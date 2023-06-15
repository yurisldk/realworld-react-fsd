import { useQueryClient } from '@tanstack/react-query';
import { useDeleteComment } from '../../model/deleteComment';

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
    <button
      style={{ border: 0, backgroundColor: 'transparent' }}
      className="mod-options"
      onClick={handleClick}
      type="button"
    >
      <span>
        <i className="ion-trash-a" />
      </span>
    </button>
  );
}
