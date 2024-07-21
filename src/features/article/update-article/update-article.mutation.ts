import {
  DefaultError,
  UseMutationOptions,
  useMutation,
} from '@tanstack/react-query'
import { ArticleService } from '~shared/api/article'
import { queryClient } from '~shared/lib/react-query'
import { ArticleQueries, articleTypes } from '~entities/article'
import { transformArticleToUpdateArticleDto } from './update-article.lib'

export function useUpdateArticleMutation(
  options?: Pick<
    UseMutationOptions<
      Awaited<ReturnType<typeof ArticleService.updateArticleMutation>>,
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
    mutationKey: ['article', 'update', ...mutationKey],

    mutationFn: (article: articleTypes.Article) => {
      const { slug } = article
      const updateArticleDto = transformArticleToUpdateArticleDto(article)
      return ArticleService.updateArticleMutation({ slug, updateArticleDto })
    },

    onMutate: async (updatedArticle) => {
      await queryClient.cancelQueries({ queryKey: ArticleQueries.keys.root })

      const previousArticle = queryClient.getQueryData(
        ArticleQueries.articleQuery(updatedArticle.slug).queryKey,
      )

      const previousInfiniteArticles = queryClient.getQueriesData({
        queryKey: ArticleQueries.keys.generalInfinity,
      })

      queryClient.setQueryData(
        ArticleQueries.articleQuery(updatedArticle.slug).queryKey,
        updatedArticle,
      )

      queryClient.setQueriesData(
        { queryKey: ArticleQueries.keys.generalInfinity },
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
