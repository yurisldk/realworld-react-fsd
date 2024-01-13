import { useMutation, useQueryClient } from '@tanstack/react-query';
import { IoTrash } from 'react-icons/io5';
import { commentApi, commentTypes } from '~entities/comment';

type DeleteCommentIconButttonProps = {
  slug: string;
  id: number;
};

export function DeleteCommentIconButtton(props: DeleteCommentIconButttonProps) {
  const { slug, id } = props;

  const queryClient = useQueryClient();
  const commentsKey = [...commentApi.COMMENTS_KEY, slug];

  const { mutate: deleteComment } = useMutation({
    mutationKey: [...commentApi.DELETE_COMMENT_KEY, slug, id],
    mutationFn: commentApi.deleteCommentMutation,
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: commentsKey });

      const prevComments =
        queryClient.getQueryData<commentTypes.Comments>(commentsKey) || [];

      const newComments = prevComments.filter((comment) => comment.id !== id);

      queryClient.setQueryData<commentTypes.Comments>(commentsKey, newComments);

      return prevComments;
    },
    onError: (_error, _variables, prevComments) => {
      if (!prevComments) return;
      queryClient.setQueryData(commentsKey, prevComments);
    },
    onSettled: async () => {
      await queryClient.invalidateQueries({ queryKey: commentsKey });
    },
  });

  const handleClick = () => {
    deleteComment({ slug, id: id + '' });
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
