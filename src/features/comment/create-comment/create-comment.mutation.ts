import {
  DefaultError,
  UseMutationOptions,
  useMutation,
} from '@tanstack/react-query'
import { CommentService } from '~shared/api/comment'
import { queryClient } from '~shared/lib/react-query'
import { CommentQueries, commentTypes } from '~entities/comment'

export function useCreateCommentMutation(
  options?: Pick<
    UseMutationOptions<
      Awaited<ReturnType<typeof CommentService.createCommentMutation>>,
      DefaultError,
      { slug: string; comment: commentTypes.Comment },
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
    mutationKey: ['comment', 'create', ...mutationKey],

    mutationFn: (config: { slug: string; comment: commentTypes.Comment }) => {
      const { slug, comment } = config
      const { body } = comment
      return CommentService.createCommentMutation(slug, {
        createCommentDto: { body },
      })
    },

    onMutate: async (variables) => {
      const { slug, comment } = variables

      await queryClient.cancelQueries({ queryKey: CommentQueries.keys.root })

      const previousComments = queryClient.getQueryData(
        CommentQueries.commentsQuery(slug).queryKey,
      )

      const updatedComments = new Map([
        ...Array.from(previousComments || []),
        [comment.id, comment],
      ])

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
