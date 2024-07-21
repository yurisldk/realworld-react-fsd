import { lazy, createElement } from 'react'
import { LoaderFunctionArgs, RouteObject } from 'react-router-dom'
import { compose, withSuspense } from '~shared/lib/react'
import { pathKeys } from '~shared/lib/react-router'
import { HomePageSkeleton } from './home-page.skeleton'

const homePageLoader = (args: LoaderFunctionArgs) =>
  import('./home-page.model').then((module) => module.HomeLoader.homePage(args))

const HomePage = lazy(() =>
  import('./home-page.ui').then((module) => ({ default: module.HomePage })),
)

const enhance = compose((component) =>
  withSuspense(component, { FallbackComponent: HomePageSkeleton }),
)

export const homePageRoute: RouteObject = {
  path: pathKeys.home(),
  element: createElement(enhance(HomePage)),
  loader: homePageLoader,
}
