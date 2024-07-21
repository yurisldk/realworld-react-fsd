import { Skeleton } from '~shared/ui/skeleton'
import { ArticlesFeedSkeleton } from '~widgets/articles-feed'
import { ProfileInfoSkeleton } from './profile-page.ui'

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
