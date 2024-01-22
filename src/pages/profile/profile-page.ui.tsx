import { useQuery, useQueryClient } from '@tanstack/react-query';
import cn from 'classnames';
import { IoSettingsSharp } from 'react-icons/io5';
import { useNavigate, useParams } from 'react-router-dom';
import { useStore } from 'zustand';
import { profileApi, profileTypes } from '~entities/profile';
import { sessionApi } from '~entities/session';
import { FollowUserButton, UnfollowUserButton } from '~features/profile';
import { PATH_PAGE } from '~shared/lib/react-router';
import { Button } from '~shared/ui/button';
import { ArticlesList } from '~widgets/articles-list';
import {
  filterByCategoryStore,
  filterByPageStore,
  profilePageStore,
} from './profile-page.model';

const onAuthorArticlesClicked =
  profilePageStore.getState().onAuthorArticlesClicked;

const onFavoritedArticlesClicked =
  profilePageStore.getState().onFavoritedArticlesClicked;

export function ProfilePage() {
  // FIXME: validate via zod
  const { username } = useParams() as { username: string };
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const activeTab = useStore(profilePageStore, (state) => state.activeTab);

  const { data: user } = useQuery({
    queryKey: sessionApi.CURRENT_USER_KEY,
    queryFn: sessionApi.currentUserQuery,
  });

  const isAuthor = user?.username === username;

  if (isAuthor) {
    queryClient.setQueryData([...profileApi.PROFILE_KEY, username], user);
  }

  const { data: profile, isSuccess } = useQuery({
    queryKey: [...profileApi.PROFILE_KEY, username],
    queryFn: () => profileApi.profileQuery(username),
    enabled: !isAuthor,
  });

  return (
    <div className="profile-page">
      <div className="user-info">
        <div className="container">
          <div className="row">
            {isSuccess && (
              <div className="col-xs-12 col-md-10 offset-md-1">
                <img
                  src={profile.image}
                  className="user-img"
                  alt={profile.username}
                />
                <h4>{profile.username}</h4>
                <p>{profile.bio}</p>

                {!isAuthor && (
                  <FollowProfileActionButtons profile={profile || user} />
                )}

                {isAuthor && (
                  <Button
                    color="secondary"
                    variant="outline"
                    className="action-btn"
                    onClick={() => navigate(PATH_PAGE.settings)}
                  >
                    <IoSettingsSharp size={14} />
                    &nbsp; Edit Profile Settings
                  </Button>
                )}
              </div>
            )}
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
                    onClick={() => onAuthorArticlesClicked(username)}
                  >
                    {`${username}`}'s Articles
                  </button>
                </li>
                <li className="nav-item">
                  <button
                    className={cn('nav-link', {
                      active: activeTab === 'favoritedArticles',
                    })}
                    type="button"
                    onClick={() => onFavoritedArticlesClicked(username)}
                  >
                    Favorited Articles
                  </button>
                </li>
              </ul>
            </div>

            <ArticlesList
              filterByCategoryStore={filterByCategoryStore}
              filterByPageStore={filterByPageStore}
            />
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
