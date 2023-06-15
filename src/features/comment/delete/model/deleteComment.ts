import { QueryClient, useMutation } from '@tanstack/react-query';
import { commentApi } from '~entities/comment';
import {
  CommentDto,
  GenericErrorModel,
  realworldApi,
} from '~shared/api/realworld';

type UseDeleteCommentProps = {
  slug: string;
  id: number;
};

export function useDeleteComment(queryClient: QueryClient) {
  return useMutation<
    void,
    GenericErrorModel,
    UseDeleteCommentProps,
    { queryKey: unknown[]; prevComments: CommentDto[] }
  >(
    async ({ slug, id }: UseDeleteCommentProps) => {
      await realworldApi.articles.deleteArticleComment(slug, id);
    },
    {
      onMutate: async ({ slug, id }) => {
        const queryKey = commentApi.commentKeys.comments.slug(slug);

        await queryClient.cancelQueries({ queryKey });

        const prevComments =
          queryClient.getQueryData<CommentDto[]>(queryKey) || [];

        const newComments: CommentDto[] = prevComments.filter(
          (comment) => comment.id !== id,
        );

        queryClient.setQueryData<CommentDto[]>(queryKey, newComments);

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
