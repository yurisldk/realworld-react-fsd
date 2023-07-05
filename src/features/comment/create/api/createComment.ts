import { QueryClient, useMutation } from '@tanstack/react-query';
import { commentApi } from '~entities/comment';
import { GenericErrorModel, realworldApi } from '~shared/api/realworld';

type UseCreateCommentProps = {
  slug: string;
  newComment: commentApi.Comment;
};

export function useCreateComment(queryClient: QueryClient) {
  return useMutation<
    commentApi.Comment,
    GenericErrorModel,
    UseCreateCommentProps,
    { queryKey: unknown[]; prevComments: commentApi.Comment[] }
  >(
    async ({ slug, newComment }: UseCreateCommentProps) => {
      const response = await realworldApi.articles.createArticleComment(slug, {
        comment: { body: newComment.body },
      });

      return commentApi.mapComment(response.data.comment);
    },
    {
      onMutate: async ({ slug, newComment }) => {
        const queryKey = commentApi.commentKeys.comments.slug(slug);

        await queryClient.cancelQueries({ queryKey });

        const prevComments =
          queryClient.getQueryData<commentApi.Comment[]>(queryKey) || [];

        const newComments: commentApi.Comment[] = [...prevComments, newComment];

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
