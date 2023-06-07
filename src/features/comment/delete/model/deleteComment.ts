import { QueryClient, useMutation } from '@tanstack/react-query';
import {
  CommentDto,
  GenericErrorModel,
  realworldApi,
} from '~shared/api/realworld';

type UseDeleteCommentProps = {
  slug: string;
  id: number;
};

export function useDeleteComment(
  queryKey: unknown[],
  queryClient: QueryClient,
) {
  return useMutation<
    void,
    GenericErrorModel,
    UseDeleteCommentProps,
    { prevComments: CommentDto[] }
  >(
    async ({ slug, id }: UseDeleteCommentProps) => {
      await realworldApi.articles.deleteArticleComment(slug, id);
    },
    {
      onMutate: async ({ id }) => {
        await queryClient.cancelQueries({ queryKey });
        const prevComments =
          queryClient.getQueryData<CommentDto[]>(queryKey) || [];

        const newComments: CommentDto[] = prevComments.filter(
          (comment) => comment.id !== id,
        );

        queryClient.setQueryData<CommentDto[]>(queryKey, newComments);

        return { prevComments };
      },

      onError: (_, __, context) => {
        queryClient.setQueryData(queryKey, context?.prevComments);
      },

      onSettled: () => {
        queryClient.invalidateQueries({ queryKey });
      },
    },
  );
}
