import { QueryClient, useMutation } from '@tanstack/react-query';
import { commentApi } from '~entities/comment';
import {
  CommentDto,
  GenericErrorModel,
  realworldApi,
} from '~shared/api/realworld';

type UseCreateCommentProps = {
  slug: string;
  newComment: CommentDto;
};

export function useCreateComment(queryClient: QueryClient) {
  return useMutation<
    CommentDto,
    GenericErrorModel,
    UseCreateCommentProps,
    { queryKey: unknown[]; prevComments: CommentDto[] }
  >(
    async ({ slug, newComment }: UseCreateCommentProps) => {
      const response = await realworldApi.articles.createArticleComment(slug, {
        comment: { body: newComment.body },
      });

      return response.data.comment;
    },
    {
      onMutate: async ({ slug, newComment }) => {
        const queryKey = commentApi.commentKeys.comments.slug(slug);

        await queryClient.cancelQueries({ queryKey });

        const prevComments =
          queryClient.getQueryData<CommentDto[]>(queryKey) || [];

        const newComments: CommentDto[] = [...prevComments, newComment];

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
