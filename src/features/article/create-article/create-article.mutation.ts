import {
  DefaultError,
  UseMutationOptions,
  useMutation,
} from '@tanstack/react-query'
import { ArticleService } from '~shared/api/article'
import { queryClient } from '~shared/lib/react-query'
import { ArticleQueries, articleLib, articleTypes } from '~entities/article'
import { CommentQueries } from '~entities/comment'
import { transformArticleToCreateArticleDto } from './create-article.lib'

export function useCreateArticleMutation(
  options?: Pick<
    UseMutationOptions<
      Awaited<ReturnType<typeof ArticleService.createArticleMutation>>,
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
    mutationKey: ['article', 'create', ...mutationKey],

    mutationFn: (article: articleTypes.Article) => {
      const createArticleDto = transformArticleToCreateArticleDto(article)
      return ArticleService.createArticleMutation({ createArticleDto })
    },

    onMutate: async (variables) => {
      await queryClient.cancelQueries({ queryKey: ArticleQueries.keys.root })

      const previousInfiniteArticles = queryClient.getQueriesData({
        queryKey: ArticleQueries.keys.generalInfinity,
      })

      queryClient.setQueryData(
        ArticleQueries.articleQuery(variables.slug).queryKey,
        variables,
      )

      queryClient.setQueriesData(
        { queryKey: ArticleQueries.keys.generalInfinity },
        (infinityArticles: articleTypes.InfiniteArticles | undefined) => {
          if (!infinityArticles) return
          const { pages, pageParams } = infinityArticles
          const updatedPages = pages.map((articles) => {
            if (articles.has(variables.slug)) return articles

            const variabless = new Map(
              Array.from([[variables.slug, variables], ...articles]),
            )

            return variabless
          })

          return { pages: updatedPages, pageParams }
        },
      )

      queryClient.setQueryData(
        CommentQueries.commentsQuery(variables.slug).queryKey,
        new Map(),
      )

      await onMutate?.(variables)

      return { previousInfiniteArticles }
    },

    onSuccess: async (data, variables, context) => {
      const createdArticle = articleLib.transformArticleDtoToArticle(data)
      queryClient.setQueryData(
        ArticleQueries.articleQuery(createdArticle.slug).queryKey,
        createdArticle,
      )

      await onSuccess?.(data, variables, context)
    },

    onError: async (error, variables, context) => {
      const { previousInfiniteArticles } = context || {}

      previousInfiniteArticles?.forEach(([queryKey, data]) => {
        queryClient.setQueriesData({ queryKey }, data)
      })

      await onError?.(error, variables, context)
    },

    onSettled: async (data, error, variables, context) => {
      queryClient.removeQueries({
        queryKey: ArticleQueries.articleQuery(variables.slug).queryKey,
        exact: true,
      })

      queryClient.removeQueries({
        queryKey: CommentQueries.commentsQuery(variables.slug).queryKey,
        exact: true,
      })

      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ArticleQueries.keys.root }),
        onSettled?.(data, error, variables, context),
      ])
    },
  })
}
