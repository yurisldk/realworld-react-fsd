import {
  DefaultError,
  UseMutationOptions,
  useMutation,
} from '@tanstack/react-query'
import { ArticleService } from '~shared/api/article'
import { queryClient } from '~shared/lib/react-query'
import { articleLib, ArticleQueries, articleTypes } from '~entities/article'
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
      await Promise.all([
        queryClient.cancelQueries({ queryKey: ArticleQueries.keys.root }),
        onMutate?.(variables),
      ])
    },

    onSuccess: async (response, variables, context) => {
      const article = articleLib.transformArticleDtoToArticle(response.data)
      const { slug } = article

      queryClient.setQueryData(
        ArticleQueries.articleQuery(slug).queryKey,
        article,
      )

      queryClient.setQueryData(
        CommentQueries.commentsQuery(slug).queryKey,
        new Map(),
      )

      await onSuccess?.(response, variables, context)
    },

    onError,

    onSettled: async (response, error, variables, context) => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ArticleQueries.keys.root }),
        onSettled?.(response, error, variables, context),
      ])
    },
  })
}
