import { DefaultError, useMutation, UseMutationOptions } from '@tanstack/react-query';
import { createComment } from '~shared/api/api.service';
import { queryClient } from '~shared/queryClient';
import { commentsQueryOptions } from '~entities/comment/comment.api';
import { transformCommentDtoToComment } from '~entities/comment/comment.lib';
import { Comment } from '~entities/comment/comment.types';
import { transformCreateCommentToCreateCommentDto } from './create-comment.lib';
import { CreateComment } from './create-comment.types';

export function useCreateCommentMutation(
  options: Pick<
    UseMutationOptions<Comment, DefaultError, CreateComment, unknown>,
    'mutationKey' | 'onMutate' | 'onSuccess' | 'onError' | 'onSettled'
  > = {},
) {
  const { mutationKey = [], onMutate, onSuccess, onError, onSettled } = options;

  return useMutation({
    mutationKey: ['comment', 'create', ...mutationKey],

    mutationFn: async (createCommentData: CreateComment) => {
      const createCommentDto = transformCreateCommentToCreateCommentDto(createCommentData);
      const { data } = await createComment(createCommentData.slug, createCommentDto);
      const comment = transformCommentDtoToComment(data);
      return comment;
    },

    onMutate,

    onSuccess: async (comment, createCommentData, context) => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: commentsQueryOptions(createCommentData.slug).queryKey }),
        onSuccess?.(comment, createCommentData, context),
      ]);
    },

    onError,

    onSettled,
  });
}
