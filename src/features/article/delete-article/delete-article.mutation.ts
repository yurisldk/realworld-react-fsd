import {
  DefaultError,
  UseMutationOptions,
  useMutation,
} from '@tanstack/react-query'
import { ArticleService } from '~shared/api/article'
import { queryClient } from '~shared/lib/react-query'
import { ArticleQueries, articleTypes } from '~entities/article'

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

    mutationFn: (slug: string) =>
      ArticleService.deleteArticleMutation({ slug }),

    onMutate: async (slug) => {
      await queryClient.cancelQueries({ queryKey: ArticleQueries.keys.root })

      const previousArticle = queryClient.getQueryData(
        ArticleQueries.articleQuery(slug).queryKey,
      )

      const previousInfiniteArticles = queryClient.getQueriesData({
        queryKey: ArticleQueries.keys.generalInfinity,
      })

      queryClient.removeQueries({
        queryKey: ArticleQueries.articleQuery(slug).queryKey,
        exact: true,
      })

      queryClient.setQueriesData(
        { queryKey: ArticleQueries.keys.generalInfinity },
        (infinityArticles: articleTypes.InfiniteArticles | undefined) => {
          if (!infinityArticles) return
          const { pages, pageParams } = infinityArticles
          const updatedPages = pages.map((articles) => {
            if (!articles.has(slug)) return articles
            const updatedArticles = new Map(articles)
            updatedArticles.delete(slug)
            return updatedArticles
          })
          return { pages: updatedPages, pageParams }
        },
      )

      await onMutate?.(slug)

      return { previousArticle, previousInfiniteArticles }
    },

    onSuccess,

    onError: async (error, slug, context) => {
      const { previousArticle, previousInfiniteArticles } = context || {}

      queryClient.setQueryData(
        ArticleQueries.articleQuery(slug).queryKey,
        previousArticle,
      )

      previousInfiniteArticles?.forEach(([queryKey, data]) => {
        queryClient.setQueriesData({ queryKey }, data)
      })

      await onError?.(error, slug, context)
    },

    onSettled: async (data, error, variables, context) => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ArticleQueries.keys.root }),
        onSettled?.(data, error, variables, context),
      ])
    },
  })
}
