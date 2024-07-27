import { Skeleton } from '~shared/ui/skeleton'
import { Stack } from '~shared/ui/stack'
import { ArticlesFeedSkeleton } from '~widgets/articles-feed'

export function ProfilePageSkeleton() {
  return (
    <div className="profile-page">
      <div className="user-info">
        <div className="container">
          <div className="row">
            <div className="col-xs-12 col-md-10 offset-md-1">
              <ProfileInfoSkeleton />
            </div>
          </div>
        </div>
      </div>

      <div className="container">
        <div className="row">
          <div className="col-xs-12 col-md-10 offset-md-1">
            <div className="articles-toggle">
              <ul className="nav nav-pills outline-active">
                <li className="nav-item">
                  <Skeleton
                    width={100}
                    height={16}
                  />
                </li>
              </ul>
            </div>

            <ArticlesFeedSkeleton />
          </div>
        </div>
      </div>
    </div>
  )
}

export function ProfileInfoSkeleton() {
  return (
    <Stack
      direction="column"
      alignItems="center"
      spacing={16}
    >
      <Skeleton
        variant="circular"
        width={100}
        height={100}
      />
      <Stack
        direction="column"
        alignItems="center"
        spacing={8}
        style={{ width: '100%' }}
      >
        <Skeleton
          width={200}
          height={26}
        />
        <Skeleton
          width={320}
          height={24}
        />
        <Skeleton
          variant="text"
          width={150}
          height={28}
          style={{ alignSelf: 'flex-end' }}
        />
      </Stack>
    </Stack>
  )
}
