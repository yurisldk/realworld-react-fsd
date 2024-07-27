import {
  DefaultError,
  UseMutationOptions,
  useMutation,
} from '@tanstack/react-query'
import { FavoriteService } from '~shared/api/favorite'
import { queryClient } from '~shared/lib/react-query'
import { ArticleQueries, articleTypes } from '~entities/article'

export function useUnfavoriteArticleMutation(
  options?: Pick<
    UseMutationOptions<
      Awaited<ReturnType<typeof FavoriteService.unfavoriteArticleMutation>>,
      DefaultError,
      articleTypes.Article,
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
    mutationKey: ['article', 'unfavorite', ...mutationKey],

    mutationFn: ({ slug }: articleTypes.Article) =>
      FavoriteService.unfavoriteArticleMutation(slug),

    onMutate: async (updatedArticle) => {
      await queryClient.cancelQueries({ queryKey: ArticleQueries.keys.root })

      const previousArticle = queryClient.getQueryData(
        ArticleQueries.articleQuery(updatedArticle.slug).queryKey,
      )

      const previousInfiniteArticles = queryClient.getQueriesData({
        queryKey: ArticleQueries.keys.rootInfinity,
      })

      queryClient.setQueryData(
        ArticleQueries.articleQuery(updatedArticle.slug).queryKey,
        updatedArticle,
      )

      queryClient.setQueriesData(
        { queryKey: ArticleQueries.keys.rootInfinity },
        (infinityArticles: articleTypes.InfiniteArticles | undefined) => {
          if (!infinityArticles) return
          const { pages, pageParams } = infinityArticles
          const updatedPages = pages.map((articles) => {
            if (!articles.has(updatedArticle.slug)) return articles
            const updatedArticles = new Map(articles)
            updatedArticles.set(updatedArticle.slug, updatedArticle)
            return updatedArticles
          })
          return { pages: updatedPages, pageParams }
        },
      )

      await onMutate?.(updatedArticle)

      return { previousArticle, previousInfiniteArticles }
    },

    onSuccess,

    onError: async (error, updatedArticle, context) => {
      const { previousInfiniteArticles, previousArticle } = context || {}

      queryClient.setQueryData(
        ArticleQueries.articleQuery(updatedArticle.slug).queryKey,
        previousArticle,
      )

      previousInfiniteArticles?.forEach(([queryKey, data]) => {
        queryClient.setQueriesData({ queryKey }, data)
      })

      await onError?.(error, updatedArticle, context)
    },

    onSettled: async (data, error, variables, context) => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ArticleQueries.keys.root }),
        onSettled?.(data, error, variables, context),
      ])
    },
  })
}
