import { useQueryClient } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { profileApi } from '~entities/profile';
import { sessionModel } from '~entities/session';
import { ToggleFollowButton } from '~features/profile';
import { PATH_PAGE } from '~shared/lib/react-router';

type ProfileCardProps = {
  username: string;
};

export function ProfileCard(props: ProfileCardProps) {
  const { username } = props;

  const queryClient = useQueryClient();

  const user = sessionModel.useCurrentUser();
  const isCurrentUser = user?.username === username;

  if (isCurrentUser) {
    queryClient.setQueryData(['profile', username], user);
  }

  const {
    data: profile,
    isLoading,
    isError,
    isSuccess,
  } = profileApi.useProfile(
    username,
    { secure: !!user },
    { enabled: !isCurrentUser },
  );

  const queryKey = profileApi.profileKeys.profile.username(username);

  return (
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
              {!isCurrentUser && (
                <ToggleFollowButton queryKey={queryKey} profile={profile} />
              )}
              {isCurrentUser && (
                <Link
                  className="btn btn-sm btn-outline-secondary action-btn"
                  to={PATH_PAGE.settings}
                >
                  <i className="ion-gear-a" /> Edit Profile Settings
                </Link>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
