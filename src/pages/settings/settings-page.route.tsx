import { createElement, lazy } from 'react'
import { LoaderFunctionArgs, RouteObject } from 'react-router-dom'
import { compose, withSuspense } from '~shared/lib/react'
import { pathKeys } from '~shared/lib/react-router'
import { SettingsPageSkeleton } from './settings-page.skeleton'

const settingsPageLoader = (args: LoaderFunctionArgs) =>
  import('./settings-page.model').then((module) =>
    module.SettingsLoader.settingsPage(args),
  )

const SettingsPage = lazy(() =>
  import('./settings-page.ui').then((module) => ({
    default: module.SettingsPage,
  })),
)

const enhance = compose((component) =>
  withSuspense(component, { FallbackComponent: SettingsPageSkeleton }),
)

export const settingsPageRoute: RouteObject = {
  path: pathKeys.settings(),
  element: createElement(enhance(SettingsPage)),
  loader: settingsPageLoader,
}
