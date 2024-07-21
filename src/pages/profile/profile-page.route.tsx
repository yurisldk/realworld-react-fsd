import { createElement, lazy } from 'react'
import { LoaderFunctionArgs, RouteObject } from 'react-router-dom'
import { compose, withSuspense } from '~shared/lib/react'
import { ProfilePageSkeleton } from './profile-page.skeleton'

const indexPageLoader = () =>
  import('./profile-page.model').then((module) =>
    module.ProfileLoader.indexPage(),
  )

const userPageLoader = (args: LoaderFunctionArgs) =>
  import('./profile-page.model').then((module) =>
    module.ProfileLoader.userPage(args),
  )

const favoritePageLoader = (args: LoaderFunctionArgs) =>
  import('./profile-page.model').then((module) =>
    module.ProfileLoader.favoritePage(args),
  )

const ProfilePage = lazy(() =>
  import('./profile-page.ui').then((module) => ({
    default: module.ProfilePage,
  })),
)

const enhance = compose((component) =>
  withSuspense(component, { FallbackComponent: ProfilePageSkeleton }),
)

export const profilePageRoute: RouteObject = {
  path: 'profile',
  children: [
    {
      index: true,
      loader: indexPageLoader,
    },
    {
      path: ':username',
      element: createElement(enhance(ProfilePage)),
      loader: userPageLoader,
    },
    {
      path: ':username/favorites',
      element: createElement(enhance(ProfilePage)),
      loader: favoritePageLoader,
    },
  ],
}
