import { createElement, lazy } from 'react'
import { LoaderFunctionArgs, RouteObject } from 'react-router-dom'
import { compose, withSuspense } from '~shared/lib/react'
import { pathKeys } from '~shared/lib/react-router'
import { LoginPageSkeleton } from './login-page.skeleton'

const loginPageLoader = (args: LoaderFunctionArgs) =>
  import('./login-page.model').then((module) =>
    module.LoginLoader.loginPage(args),
  )

const LoginPage = lazy(() =>
  import('./login-page.ui').then((module) => ({
    default: module.LoginPage,
  })),
)

const enhance = compose((component) =>
  withSuspense(component, { FallbackComponent: LoginPageSkeleton }),
)

export const loginPageRoute: RouteObject = {
  path: pathKeys.login(),
  element: createElement(enhance(LoginPage)),
  loader: loginPageLoader,
}
