import {
  DefaultError,
  UseMutationOptions,
  useMutation,
} from '@tanstack/react-query'
import { FavoriteService } from '~shared/api/favorite'
import { queryClient } from '~shared/lib/react-query'
import { ArticleQueries, articleTypes } from '~entities/article'

export function useFavoriteArticleMutation(
  options?: Pick<
    UseMutationOptions<
      Awaited<ReturnType<typeof FavoriteService.favoriteArticleMutation>>,
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
    mutationKey: ['article', 'favorite', ...mutationKey],

    mutationFn: (slug) => FavoriteService.favoriteArticleMutation(slug),

    onMutate: async (slug) => {
      await queryClient.cancelQueries({ queryKey: ArticleQueries.keys.root })

      const previousArticle = queryClient.getQueryData(
        ArticleQueries.articleQuery(slug).queryKey,
      )

      const updatedArticle = previousArticle && {
        ...previousArticle,
        favorited: true,
        favoritesCount: previousArticle.favoritesCount + 1,
      }

      const previousInfiniteArticles =
        queryClient.getQueriesData<articleTypes.InfiniteArticles>({
          queryKey: ArticleQueries.keys.rootInfinity,
        })

      queryClient.setQueryData(
        ArticleQueries.articleQuery(slug).queryKey,
        updatedArticle,
      )

      queryClient.setQueriesData(
        { queryKey: ArticleQueries.keys.rootInfinity },
        (infinityArticles: articleTypes.InfiniteArticles | undefined) => {
          if (!infinityArticles) return

          const { pages, pageParams } = infinityArticles

          const updatedPages = pages.map((articles) => {
            if (!articles.has(slug)) return articles

            const updatedArticles = new Map(articles)
            const previousArticlePreview = articles.get(slug)!

            const updatedArticlePreview = {
              ...previousArticlePreview,
              favorited: true,
              favoritesCount: previousArticlePreview.favoritesCount + 1,
            }

            updatedArticles.set(slug, updatedArticlePreview)

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
