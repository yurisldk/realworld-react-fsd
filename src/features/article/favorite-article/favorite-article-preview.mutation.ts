import {
  DefaultError,
  UseMutationOptions,
  useMutation,
} from '@tanstack/react-query'
import { FavoriteService } from '~shared/api/favorite'
import { queryClient } from '~shared/lib/react-query'
import { ArticleQueries, articleTypes } from '~entities/article'

export function useFavoriteArticlePreviewMutation(
  options?: Pick<
    UseMutationOptions<
      Awaited<ReturnType<typeof FavoriteService.favoriteArticleMutation>>,
      DefaultError,
      articleTypes.ArticlePreview,
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
    mutationKey: ['article', 'favorite', ...mutationKey],

    mutationFn: ({ slug }: articleTypes.ArticlePreview) =>
      FavoriteService.favoriteArticleMutation(slug),

    onMutate: async (updatedArticle) => {
      await queryClient.cancelQueries({ queryKey: ArticleQueries.keys.root })

      const previousInfiniteArticles = queryClient.getQueriesData({
        queryKey: ArticleQueries.keys.rootInfinity,
      })

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

      return { previousInfiniteArticles }
    },

    onSuccess,

    onError: async (error, updatedArticle, context) => {
      const { previousInfiniteArticles } = context || {}

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
