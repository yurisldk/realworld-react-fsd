import {
  queryOptions as tsqQueryOptions,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query';
import dayjs from 'dayjs';
// eslint-disable-next-line no-restricted-imports
import { userService } from '~entities/session/@x/comment';
import { queryClient } from '~shared/lib/react-query';
import {
  commentsQuery,
  createCommentMutation,
  deleteCommentMutation,
} from './comment.api';
import { Comments } from './comment.types';

const keys = {
  root: () => ['comment'],
  comments: (slug: string) => [...keys.root(), 'comments', slug],
  createComment: (slug: string) =>
    [...keys.root(), 'createComment', slug] as const,
  deleteComment: (slug: string) =>
    [...keys.root(), 'deleteComment', slug] as const,
};

export const commentsService = {
  queryKey: (slug: string) => keys.comments(slug),

  getCache: (slug: string) =>
    queryClient.getQueryData<Comments>(commentsService.queryKey(slug)),

  setCache: (slug: string, comments: Comments) =>
    queryClient.setQueryData(commentsService.queryKey(slug), comments),

  removeCache: (slug: string) =>
    queryClient.removeQueries({ queryKey: commentsService.queryKey(slug) }),

  queryOptions: (slug: string) => {
    const commentsKey = commentsService.queryKey(slug);
    return tsqQueryOptions({
      queryKey: commentsKey,
      queryFn: async ({ signal }) => commentsQuery({ slug }, signal),
      initialData: () => commentsService.getCache(slug)!,
      initialDataUpdatedAt: () =>
        queryClient.getQueryState(commentsKey)?.dataUpdatedAt,
    });
  },

  prefetchQuery: async (slug: string) =>
    queryClient.prefetchQuery(commentsService.queryOptions(slug)),

  ensureQueryData: async (slug: string) =>
    queryClient.ensureQueryData(commentsService.queryOptions(slug)),
};

export function useCreateCommentMutation(slug: string) {
  const queryClient = useQueryClient();
  const commentsKey = commentsService.queryKey(slug);

  return useMutation({
    mutationKey: keys.createComment(slug),
    mutationFn: createCommentMutation,
    onMutate: async ({ comment, slug }) => {
      await queryClient.cancelQueries({ queryKey: commentsKey });

      const author = userService.getCache();

      const newComment = author && {
        id: +Infinity,
        createdAt: dayjs().toISOString(),
        updatedAt: dayjs().toISOString(),
        body: comment.body,
        author: {
          ...author,
          following: false,
        },
      };

      const prevComments = commentsService.getCache(slug) || [];

      if (newComment) {
        commentsService.setCache(slug, [...prevComments, newComment]);
      }

      return { prevComments };
    },
    onError: (_error, variables, context) => {
      if (!context) return;
      commentsService.setCache(variables.slug, context.prevComments);
    },
    onSettled: async () => {
      await queryClient.invalidateQueries({ queryKey: commentsKey });
    },
  });
}

export function useDeleteCommentMutation(slug: string) {
  const queryClient = useQueryClient();
  const commentsKey = commentsService.queryKey(slug);

  return useMutation({
    mutationKey: keys.deleteComment(slug),
    mutationFn: deleteCommentMutation,
    onMutate: async ({ id, slug }) => {
      await queryClient.cancelQueries({ queryKey: commentsKey });

      const prevComments = commentsService.getCache(slug) || [];

      const newComments = prevComments.filter((comment) => comment.id !== +id);

      commentsService.setCache(slug, newComments);

      return { prevComments };
    },
    onError: (_error, _variables, context) => {
      if (!context) return;
      commentsService.setCache(slug, context.prevComments);
    },
    onSettled: async () => {
      await queryClient.invalidateQueries({ queryKey: commentsKey });
    },
  });
}
