import { createElement, lazy } from 'react'
import { LoaderFunctionArgs, RouteObject } from 'react-router-dom'
import { compose, withSuspense } from '~shared/lib/react'
import { ArticlePageSkeleton } from './article-page.skeleton'

const indexPageLoader = () =>
  import('./article-page.model').then((module) =>
    module.ArticleLoader.indexPage(),
  )

const articlePageLoader = (args: LoaderFunctionArgs) =>
  import('./article-page.model').then((module) =>
    module.ArticleLoader.articlePage(args),
  )

const ArticlePage = lazy(() =>
  import('./article-page.ui').then((module) => ({
    default: module.ArticlePage,
  })),
)

const enhance = compose((component) =>
  withSuspense(component, { FallbackComponent: ArticlePageSkeleton }),
)

export const articlePageRoute: RouteObject = {
  path: 'article',
  children: [
    {
      index: true,
      loader: indexPageLoader,
    },
    {
      path: ':slug',
      element: createElement(enhance(ArticlePage)),
      loader: articlePageLoader,
    },
  ],
}
