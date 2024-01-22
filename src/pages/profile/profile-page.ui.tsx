import { useQueries } from '@tanstack/react-query';
import cn from 'classnames';
import { IoSettingsSharp } from 'react-icons/io5';
import { useNavigate, useParams } from 'react-router-dom';
import { useStore } from 'zustand';
import { profileQueries, profileTypes } from '~entities/profile';
import { sessionQueries } from '~entities/session';
import { FollowUserButton, UnfollowUserButton } from '~features/profile';
import { pathKeys, routerTypes } from '~shared/lib/react-router';
import { Button } from '~shared/ui/button';
import { ErrorHandler } from '~shared/ui/error';
import { ArticlesList } from '~widgets/articles-list';
import {
  articleFilterStore,
  onAuthorArticles,
  onAuthorFavoritedArticles,
  tabStore,
} from './profile-page.model';

export function ProfilePage() {
  const { username } = useParams() as routerTypes.UsernamePageParams;
  const navigate = useNavigate();

  const activeTab = useStore(tabStore, (state) => state.tab);

  const [user, profile] = useQueries({
    queries: [
      sessionQueries.currentUserQueryOptions(),
      profileQueries.profileService.queryOptions(username),
    ],
  });

  if (profile.isLoading) {
    return 'loading...';
  }

  if (profile.isError) {
    return <ErrorHandler error={profile.error} />;
  }

  const isOwner = user.data.username === profile.data.username;

  return (
    <div className="profile-page">
      <div className="user-info">
        <div className="container">
          <div className="row">
            <div className="col-xs-12 col-md-10 offset-md-1">
              <img
                src={profile.data.image}
                className="user-img"
                alt={profile.data.username}
              />
              <h4>{profile.data.username}</h4>
              <p>{profile.data.bio}</p>

              {!isOwner && (
                <FollowProfileActionButtons profile={profile.data} />
              )}

              {isOwner && (
                <Button
                  color="secondary"
                  variant="outline"
                  className="action-btn"
                  onClick={() => navigate(pathKeys.settings())}
                >
                  <IoSettingsSharp size={14} />
                  &nbsp; Edit Profile Settings
                </Button>
              )}
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
                  <button
                    className={cn('nav-link', {
                      active: activeTab === 'authorArticles',
                    })}
                    type="button"
                    onClick={() => onAuthorArticles(profile.data.username)}
                  >
                    {`${profile.data.username}`}'s Articles
                  </button>
                </li>
                <li className="nav-item">
                  <button
                    className={cn('nav-link', {
                      active: activeTab === 'authorFavoritedArticles',
                    })}
                    type="button"
                    onClick={() =>
                      onAuthorFavoritedArticles(profile.data.username)
                    }
                  >
                    Favorited Articles
                  </button>
                </li>
              </ul>
            </div>

            <ArticlesList filterStore={articleFilterStore} />
          </div>
        </div>
      </div>
    </div>
  );
}

type FollowProfileActionButtonsProps = { profile: profileTypes.Profile };
const FollowProfileActionButtons = (props: FollowProfileActionButtonsProps) =>
  props.profile.following ? (
    <UnfollowUserButton profile={props.profile} />
  ) : (
    <FollowUserButton profile={props.profile} />
  );
