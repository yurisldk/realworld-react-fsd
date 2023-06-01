import { useReducer } from 'react';
import { useParams } from 'react-router-dom';
import { profileApi } from '~entities/profile';
import { FavoritedArticlesList } from '~widgets/favorited-articles-list';
import { ProfileArticlesList } from '~widgets/profile-articles-list';

type TabsState = {
  profile: boolean;
  favorites: boolean;
};

type Action = { type: 'profile' } | { type: 'favorites' };

function reducer(_: TabsState, action: Action): TabsState {
  switch (action.type) {
    case 'profile':
      return { profile: true, favorites: false };
    case 'favorites':
      return { profile: false, favorites: true };

    default:
      throw new Error();
  }
}

function toggleProfile(dispatch: React.Dispatch<Action>) {
  return dispatch({ type: 'profile' });
}

function toggleFavorites(dispatch: React.Dispatch<Action>) {
  return dispatch({ type: 'favorites' });
}

type ProfilePageProps = {
  favorites?: boolean;
};

export function ProfilePage(props: ProfilePageProps) {
  const { favorites } = props;
  const { username } = useParams();

  // TODO: handle error
  // TODO: navigate to 404 username that doesnt exists (404)
  const {
    data: profile,
    isLoading,
    isError,
    isSuccess,
  } = profileApi.useProfile(username!);

  const initialState: TabsState = {
    profile: !favorites,
    favorites: Boolean(favorites),
  };

  const [tabs, dispatch] = useReducer(reducer, initialState);

  return (
    <div className="profile-page">
      <div className="user-info">
        <div className="container">
          <div className="row">
            {isLoading && <div>loading</div>}
            {isError && <div>error</div>}
            {isSuccess && (
              <div className="col-xs-12 col-md-10 offset-md-1">
                <img
                  src={profile.image}
                  className="user-img"
                  alt={profile.username}
                />
                <h4>{profile.username}</h4>
                <p>{profile.bio}</p>
                <button
                  className="btn btn-sm btn-outline-secondary action-btn"
                  type="button"
                >
                  <i className="ion-plus-round" />
                  &nbsp; Follow {profile.username}
                </button>
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
                  {/* FIXME: add classnames */}
                  <button
                    className={`nav-link ${tabs.profile && 'active'}`}
                    type="button"
                    onClick={() => toggleProfile(dispatch)}
                  >
                    My Articles
                  </button>
                </li>
                <li className="nav-item">
                  <button
                    className={`nav-link ${tabs.favorites && 'active'}`}
                    type="button"
                    onClick={() => toggleFavorites(dispatch)}
                  >
                    Favorited Articles
                  </button>
                </li>
              </ul>
            </div>

            {tabs.profile && (
              <ProfileArticlesList username={username as string} />
            )}

            {tabs.favorites && (
              <FavoritedArticlesList username={username as string} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
