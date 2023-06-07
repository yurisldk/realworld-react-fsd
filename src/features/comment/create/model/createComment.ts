import { QueryClient, useMutation } from '@tanstack/react-query';
import { sessionApi } from '~entities/session';
import {
  CommentDto,
  GenericErrorModel,
  NewCommentDto,
  ProfileDto,
  UserDto,
  realworldApi,
} from '~shared/api/realworld';

type UseCreateCommentProps = {
  slug: string;
  comment: NewCommentDto;
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
    async ({ slug, comment }: UseCreateCommentProps) => {
      const response = await realworldApi.articles.createArticleComment(slug, {
        comment,
      });

      return response.data.comment;
    },
    {
      onMutate: async ({ slug, comment }) => {
        await queryClient.cancelQueries({ queryKey });

        // TODO: add sessionKeys to sessionApi
        const user = queryClient.getQueryData<UserDto>(
          sessionApi.sessionKeys.session.currentUser(),
        );

        if (!user) return undefined;

        const { token, ...other } = user;
        const author: ProfileDto = { ...other, following: false };

        const prevComments =
          queryClient.getQueryData<CommentDto[]>(queryKey) || [];

        const newComment: CommentDto = {
          // @ts-expect-error
          id: slug,
          createdAt: Date.now().toString(),
          updatedAt: Date.now().toString(),
          author,
          body: comment.body,
        };

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
