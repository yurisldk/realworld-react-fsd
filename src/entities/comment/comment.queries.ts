import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import dayjs from 'dayjs';
import { sessionTypes } from '~entities/session';
import {
  commentsQuery,
  createCommentMutation,
  deleteCommentMutation,
} from './comment.api';
import { Comment, Comments } from './comment.types';

export const commentKeys = {
  root: ['comment'] as const,
  comments() {
    return [...commentKeys.root, 'comments'] as const;
  },
  createComment(slug: string) {
    return [...commentKeys.root, 'createComment', slug] as const;
  },
  deleteComment(slug: string) {
    return [...commentKeys.root, 'deleteComment', slug] as const;
  },
};

export function useCommentsQuery(slug: string) {
  return useQuery({
    queryKey: commentKeys.comments(),
    queryFn: () => commentsQuery(slug),
  });
}

export function useCreateCommentMutation(slug: string) {
  const queryClient = useQueryClient();
  const commentsKey = commentKeys.comments();

  return useMutation({
    mutationKey: commentKeys.createComment(slug),
    mutationFn: createCommentMutation,
    onMutate: async ({ comment }) => {
      await queryClient.cancelQueries({ queryKey: commentsKey });

      const author = queryClient.getQueryData<sessionTypes.User>([
        'sessionKeys.user',
      ]);

      const newComment: Comment = {
        id: +Infinity,
        createdAt: dayjs().toISOString(),
        updatedAt: dayjs().toISOString(),
        body: comment.body,
        author: {
          ...author!,
          following: false,
        },
      };

      const prevComments =
        queryClient.getQueryData<Comments>(commentsKey) || [];

      const newComments = [...prevComments, newComment];

      queryClient.setQueryData<Comments>(commentsKey, newComments);

      return { prevComments };
    },
    onError: (_error, _variables, context) => {
      if (!context) return;
      queryClient.setQueryData(commentsKey, context.prevComments);
    },
    onSettled: async () => {
      await queryClient.invalidateQueries({ queryKey: commentsKey });
    },
  });
}

export function useDeleteCommentMutation(slug: string) {
  const queryClient = useQueryClient();
  const commentsKey = commentKeys.comments();

  return useMutation({
    mutationKey: commentKeys.deleteComment(slug),
    mutationFn: deleteCommentMutation,
    onMutate: async ({ id }) => {
      await queryClient.cancelQueries({ queryKey: commentsKey });

      const prevComments =
        queryClient.getQueryData<Comments>(commentsKey) || [];

      const newComments = prevComments.filter((comment) => comment.id !== +id);

      queryClient.setQueryData<Comments>(commentsKey, newComments);

      return { prevComments };
    },
    onError: (_error, _variables, context) => {
      if (!context) return;
      queryClient.setQueryData(commentsKey, context.prevComments);
    },
    onSettled: async () => {
      await queryClient.invalidateQueries({ queryKey: commentsKey });
    },
  });
}
