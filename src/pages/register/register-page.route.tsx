import { createElement, lazy } from 'react'
import { LoaderFunctionArgs, RouteObject } from 'react-router-dom'
import { compose, withSuspense } from '~shared/lib/react'
import { pathKeys } from '~shared/lib/react-router'
import { RegisterPageSkeleton } from './register-page.skeleton'

const registerPageLoader = (args: LoaderFunctionArgs) =>
  import('./register-page.model').then((module) =>
    module.RegisterLoader.registerPage(args),
  )

const RegisterPage = lazy(() =>
  import('./register-page.ui').then((module) => ({
    default: module.RegisterPage,
  })),
)

const enhance = compose((component) =>
  withSuspense(component, { FallbackComponent: RegisterPageSkeleton }),
)

export const registerPageRoute: RouteObject = {
  path: pathKeys.register(),
  element: createElement(enhance(RegisterPage)),
  loader: registerPageLoader,
}
