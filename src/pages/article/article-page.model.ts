import { LoaderFunctionArgs, redirect } from 'react-router-dom'
import { z } from 'zod'
import { ValidationError, createValidationIssue } from '~shared/lib/error'
import { queryClient } from '~shared/lib/react-query'
import { pathKeys, routerContracts } from '~shared/lib/react-router'
import { SessionQueries, useSessionStore } from '~shared/session'
import { ArticleQueries } from '~entities/article'
import { CommentQueries } from '~entities/comment'

const ArticleLoaderDataSchema = z.object({
  request: z.custom<Request>(),
  params: routerContracts.SlugPageParamsSchema,
  context: z.any(),
})

export type ArticleLoaderData = z.infer<typeof ArticleLoaderDataSchema>

export class ArticleLoader {
  static async indexPage() {
    return redirect(pathKeys.page404())
  }

  static async articlePage(args: LoaderFunctionArgs) {
    const articleData = ArticleLoader.getArticleLoaderData(args)
    const { slug } = articleData.params

    const promises = [
      queryClient.prefetchQuery(ArticleQueries.articleQuery(slug)),
      queryClient.prefetchQuery(CommentQueries.commentsQuery(slug)),
    ]

    if (useSessionStore.getState().session) {
      const currentUserQuery = SessionQueries.currentSessionQuery()
      promises.push(queryClient.prefetchQuery(currentUserQuery))
    }

    Promise.all(promises)

    return articleData
  }

  private static getArticleLoaderData(args: LoaderFunctionArgs) {
    const validation = ArticleLoaderDataSchema.safeParse(args)

    if (validation.error) {
      throw createValidationIssue({
        errors: validation.error.errors,
        cause: new ValidationError(),
      })
    }

    return validation.data
  }
}
