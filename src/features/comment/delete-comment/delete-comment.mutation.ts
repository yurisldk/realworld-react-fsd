import {
  DefaultError,
  UseMutationOptions,
  useMutation,
} from '@tanstack/react-query'
import { CommentService } from '~shared/api/comment'
import { queryClient } from '~shared/lib/react-query'
import { CommentQueries } from '~entities/comment'

export function useDeleteCommentMutation(
  options?: Pick<
    UseMutationOptions<
      Awaited<ReturnType<typeof CommentService.deleteCommentMutation>>,
      DefaultError,
      { id: number; slug: string },
      unknown
    >,
    'mutationKey' | 'onMutate' | 'onSuccess' | 'onError' | 'onSettled'
  >,
) {
  const {
    mutationKey = [],
    onMutate,
    onSuccess,
    onError,
    onSettled,
  } = options || {}

  return useMutation({
    mutationKey: ['comment', 'delete', ...mutationKey],

    mutationFn: (config: { id: number; slug: string }) =>
      CommentService.deleteCommentMutation(config.slug, config.id),

    onMutate: async (variables) => {
      const { id, slug } = variables

      await queryClient.cancelQueries({
        queryKey: CommentQueries.keys.root,
      })

      const previousComments = queryClient.getQueryData(
        CommentQueries.commentsQuery(slug).queryKey,
      )

      const updatedComments = new Map(previousComments)
      updatedComments.delete(id)

      queryClient.setQueryData(
        CommentQueries.commentsQuery(slug).queryKey,
        updatedComments,
      )

      await onMutate?.(variables)

      return { previousComments }
    },

    onSuccess,

    onError: async (error, variables, context) => {
      const { slug } = variables
      const { previousComments } = context || {}

      queryClient.setQueryData(
        CommentQueries.commentsQuery(slug).queryKey,
        previousComments,
      )

      await onError?.(error, variables, context)
    },

    onSettled: async (data, error, variables, context) => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: CommentQueries.keys.root }),
        onSettled?.(data, error, variables, context),
      ])
    },
  })
}
