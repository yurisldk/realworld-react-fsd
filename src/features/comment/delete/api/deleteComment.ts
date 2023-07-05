import { QueryClient, useMutation } from '@tanstack/react-query';
import { commentApi } from '~entities/comment';
import { GenericErrorModel, realworldApi } from '~shared/api/realworld';

type UseDeleteCommentProps = {
  slug: string;
  id: number;
};

export function useDeleteComment(queryClient: QueryClient) {
  return useMutation<
    any,
    GenericErrorModel,
    UseDeleteCommentProps,
    { queryKey: string[]; prevComments: commentApi.Comment[] }
  >(
    async ({ slug, id }: UseDeleteCommentProps) => {
      const response = await realworldApi.articles.deleteArticleComment(
        slug,
        id,
      );
      return response.data;
    },
    {
      onMutate: async ({ slug, id }) => {
        const queryKey = commentApi.commentKeys.comments.slug(slug);

        await queryClient.cancelQueries({ queryKey });

        const prevComments =
          queryClient.getQueryData<commentApi.Comment[]>(queryKey) || [];

        const newComments: commentApi.Comment[] = prevComments.filter(
          (comment) => comment.id !== id,
        );

        queryClient.setQueryData<commentApi.Comment[]>(queryKey, newComments);

        return { queryKey, prevComments };
      },

      onError: (_error, _variables, context) => {
        if (!context) return;
        queryClient.setQueryData(context.queryKey, context.prevComments);
      },

      onSettled: (_data, _error, _valiables, context) => {
        if (!context) return;
        queryClient.invalidateQueries({ queryKey: context.queryKey });
      },
    },
  );
}
