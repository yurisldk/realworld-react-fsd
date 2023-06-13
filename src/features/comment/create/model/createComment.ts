import { QueryClient, useMutation } from '@tanstack/react-query';
import {
  CommentDto,
  GenericErrorModel,
  realworldApi,
} from '~shared/api/realworld';

type UseCreateCommentProps = {
  slug: string;
  newComment: CommentDto;
};

export function useCreateComment(
  queryKey: unknown[],
  queryClient: QueryClient,
) {
  return useMutation<
    CommentDto,
    GenericErrorModel,
    UseCreateCommentProps,
    { prevComments: CommentDto[] }
  >(
    async ({ slug, newComment }: UseCreateCommentProps) => {
      const response = await realworldApi.articles.createArticleComment(slug, {
        comment: { body: newComment.body },
      });

      return response.data.comment;
    },
    {
      onMutate: async ({ newComment }) => {
        await queryClient.cancelQueries({ queryKey });

        const prevComments =
          queryClient.getQueryData<CommentDto[]>(queryKey) || [];

        const newComments: CommentDto[] = [...prevComments, newComment];

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
