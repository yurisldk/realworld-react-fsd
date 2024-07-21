import { LoaderFunctionArgs, redirect } from 'react-router-dom'
import { ValidationError, createValidationIssue } from '~shared/lib/error'
import { queryClient } from '~shared/lib/react-query'
import { pathKeys, routerContracts } from '~shared/lib/react-router'
import {
  PermissionService,
  SessionQueries,
  useSessionStore,
} from '~shared/session'
import { ArticleQueries } from '~entities/article'

export class EditorLoader {
  static async editorCreatePage(args: LoaderFunctionArgs) {
    if (!EditorLoader.ensureSession()) {
      return redirect(pathKeys.login())
    }

    EditorLoader.prefetchCurrentUser()

    return args
  }

  static async editorUpdatePage(args: LoaderFunctionArgs) {
    if (!EditorLoader.ensureSession()) {
      return redirect(pathKeys.login())
    }

    const editorData = EditorLoader.getEditorData(args)
    const { slug } = editorData.params

    EditorLoader.prefetchEditorData(slug)

    return editorData
  }

  private static ensureSession(): boolean {
    return !!useSessionStore.getState().session
  }

  private static async prefetchCurrentUser() {
    const currentUserQuery = SessionQueries.currentSessionQuery()
    queryClient.prefetchQuery(currentUserQuery)
  }

  private static async prefetchEditorData(slug: string) {
    const currentUserQuery = SessionQueries.currentSessionQuery()
    const articleQuery = ArticleQueries.articleQuery(slug)

    Promise.all([
      queryClient.prefetchQuery(currentUserQuery),
      queryClient.prefetchQuery(articleQuery),
    ])
  }

  private static getEditorData(args: LoaderFunctionArgs) {
    const homeContext = EditorLoader.getEditorContext()

    const editorData = {
      ...args,
      context: { ...args.context, ...homeContext },
    }

    const validation =
      routerContracts.EditorPageArgsSchema.safeParse(editorData)

    if (validation.error) {
      throw createValidationIssue({
        errors: validation.error.errors,
        cause: new ValidationError(),
      })
    }

    return validation.data
  }

  private static getEditorContext() {
    return {
      canCreateArticle: PermissionService.canPerformAction('create', 'article'),

      canUpdateArticle: PermissionService.canPerformAction(
        'update',
        'article',
        { articleAuthorId: '' },
      ),
    }
  }
}
