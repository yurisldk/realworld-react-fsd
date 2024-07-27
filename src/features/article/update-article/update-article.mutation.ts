import {
  DefaultError,
  UseMutationOptions,
  useMutation,
} from '@tanstack/react-query'
import { ArticleService } from '~shared/api/article'
import { queryClient } from '~shared/lib/react-query'
import { articleLib, ArticleQueries, articleTypes } from '~entities/article'
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
      return ArticleService.updateArticleMutation(slug, { updateArticleDto })
    },

    onMutate: async (updatedArticle) => {
      await Promise.all([
        queryClient.cancelQueries({ queryKey: ArticleQueries.keys.root }),
        onMutate?.(updatedArticle),
      ])
    },

    onSuccess: async (response, variables, context) => {
      const article = articleLib.transformArticleDtoToArticle(response.data)
      const { slug } = article

      queryClient.setQueryData(
        ArticleQueries.articleQuery(slug).queryKey,
        article,
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
