import { useSuspenseQuery } from '@tanstack/react-query'
import { withErrorBoundary } from 'react-error-boundary'
import { IoAdd, IoSettingsSharp } from 'react-icons/io5'
import { useLoaderData, useNavigate } from 'react-router-dom'
import { compose, withSuspense } from '~shared/lib/react'
import { pathKeys, routerTypes } from '~shared/lib/react-router'
import { PermissionService } from '~shared/session'
import { Button } from '~shared/ui/button'
import { ErrorHandler, logError } from '~shared/ui/error-handler'
import { ArticleQueries } from '~entities/article'
import { ProfileQueries, profileTypes } from '~entities/profile'
import { ProfileFilter } from '~features/article'
import { FollowUserButton, UnfollowUserButton } from '~features/profile'
import { ArticlesFeed } from '~widgets/articles-feed'
import { profileModel } from './profile-page.model'
import { ProfileInfoSkeleton } from './profile-page.skeleton'

export function ProfilePage() {
  const { params } = useLoaderData() as routerTypes.ProfilePageData
  const { username } = params

  return (
    <div className="profile-page">
      <div className="user-info">
        <div className="container">
          <div className="row">
            <div className="col-xs-12 col-md-10 offset-md-1">
              <ProfileInfo username={username} />
            </div>
          </div>
        </div>
      </div>

      <div className="container">
        <div className="row">
          <div className="col-xs-12 col-md-10 offset-md-1">
            <ProfileFilter
              username={username}
              profileArticleFilter={profileModel}
            />
            <ArticlesFeed
              useArticleFilterStore={profileModel.useProfileArticleFilterStore}
              articlesInfiniteQueryOptions={boundArticlesInfiniteQuery}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

type ProfileInfoProps = { username: string }

const enhance = compose<ProfileInfoProps>(
  (component) =>
    withErrorBoundary(component, {
      FallbackComponent: ErrorHandler,
      onError: logError,
    }),
  (component) =>
    withSuspense(component, { FallbackComponent: ProfileInfoSkeleton }),
)

const ProfileInfo = enhance((props: ProfileInfoProps) => {
  const { username } = props

  const { data: profile } = useSuspenseQuery(
    ProfileQueries.profileQuery(username),
  )

  return (
    <>
      <img
        src={profile.image}
        className="user-img"
        alt={profile.username}
      />
      <h4>{profile.username}</h4>
      <p>{profile.bio}</p>

      <ToggleFollowProfile profile={profile} />
    </>
  )
})

function ToggleFollowProfile(props: { profile: profileTypes.Profile }) {
  const { profile } = props
  const { username, following } = profile

  const canUpdateProfile = PermissionService.useCanPerformAction(
    'update',
    'profile',
    { profileOwnerId: username },
  )
  const canFollow = PermissionService.useCanPerformAction('follow', 'profile')
  const canUnfollow = PermissionService.useCanPerformAction(
    'unfollow',
    'profile',
  )
  const canFollowProfile = !canUpdateProfile && canFollow && !following
  const canUnfollowProfile = !canUpdateProfile && canUnfollow && following
  const cannotFollowAndUnfollowProfile = !canFollow && !canUnfollow

  return (
    <>
      {canFollowProfile && <FollowUserButton profile={profile} />}
      {canUnfollowProfile && <UnfollowUserButton profile={profile} />}
      {canUpdateProfile && <NavigateToSettingsButton />}
      {cannotFollowAndUnfollowProfile && (
        <NavigateToLoginButton username={profile.username} />
      )}
    </>
  )
}

function NavigateToSettingsButton() {
  const navigate = useNavigate()

  return (
    <Button
      color="secondary"
      variant="outline"
      className="action-btn"
      onClick={() => navigate(pathKeys.settings())}
    >
      <IoSettingsSharp size={14} />
      &nbsp; Edit Profile Settings
    </Button>
  )
}

function NavigateToLoginButton(props: { username: string }) {
  const { username } = props

  const navigate = useNavigate()

  const onClick = () => navigate(pathKeys.login())

  return (
    <Button
      color="secondary"
      variant="outline"
      className="action-btn "
      onClick={onClick}
    >
      <IoAdd size={16} />
      &nbsp; Follow {username}
    </Button>
  )
}

const boundArticlesInfiniteQuery =
  ArticleQueries.articlesInfiniteQuery.bind(ArticleQueries)
