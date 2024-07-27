import {
  DefaultError,
  UseMutationOptions,
  useMutation,
} from '@tanstack/react-query'
import { ArticleService } from '~shared/api/article'
import { queryClient } from '~shared/lib/react-query'
import { ArticleQueries } from '~entities/article'

export function useDeleteArticleMutation(
  options?: Pick<
    UseMutationOptions<
      Awaited<ReturnType<typeof ArticleService.deleteArticleMutation>>,
      DefaultError,
      string,
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
    mutationKey: ['article', 'delete', ...mutationKey],

    mutationFn: (slug: string) => ArticleService.deleteArticleMutation(slug),

    onMutate: async (slug) => {
      await Promise.all([
        queryClient.cancelQueries({ queryKey: ArticleQueries.keys.root }),
        onMutate?.(slug),
      ])
    },

    onSuccess,

    onError,

    onSettled: async (response, error, variables, context) => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ArticleQueries.keys.root }),
        onSettled?.(response, error, variables, context),
      ])
    },
  })
}
