import { ReactNode } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { IoAdd, IoSettingsSharp } from 'react-icons/io5';
import { useNavigate } from 'react-router-dom';
import { profileApi } from '~entities/profile';
import { sessionApi } from '~entities/session';
import { FollowUserButton, UnfollowUserButton } from '~features/profile';
import { PATH_PAGE } from '~shared/lib/react-router';
import { Button } from '~shared/ui/button';
import { Spinner } from '~shared/ui/spinner';

type ProfileCardProps = { username: string };

export function ProfileCard(props: ProfileCardProps) {
  const { username } = props;

  const navigate = useNavigate();
  const queryClient = useQueryClient();

  // TODO: add loading, error, etc... states
  const { data: user } = useQuery({
    queryKey: sessionApi.CURRENT_USER_KEY,
    queryFn: sessionApi.currentUserQuery,
  });

  const isAuth = Boolean(user);
  const isGuest = !isAuth;
  const isUser = isAuth && !(user?.username === username);
  const isCurrentUser = isAuth && user?.username === username;

  if (isCurrentUser) {
    queryClient.setQueryData(['profile', username], user);
  }

  const {
    data: profile,
    isLoading,
    isSuccess,
  } = useQuery({
    queryKey: [...profileApi.PROFILE_KEY, username],
    queryFn: () => profileApi.profileQuery(username),
  });

  // if (isError && error. === 404)
  //   return <Navigate to={PATH_PAGE.page404} />;

  return (
    <div className="user-info">
      <div className="container">
        <div className="row">
          {isLoading && (
            <ProfileWrapper>
              <Spinner />
            </ProfileWrapper>
          )}

          {/* {isError && (
            <ProfileWrapper>
              <ErrorHandler error={error} />
            </ProfileWrapper>
          )} */}

          {isSuccess && (
            <div className="col-xs-12 col-md-10 offset-md-1">
              <img
                src={profile.image}
                className="user-img"
                alt={profile.username}
              />
              <h4>{profile.username}</h4>
              <p>{profile.bio}</p>

              {isGuest && (
                <Button
                  color="secondary"
                  variant="outline"
                  className="action-btn"
                  onClick={() => navigate(PATH_PAGE.login)}
                >
                  <IoAdd size={16} />
                  &nbsp; Follow {profile.username}
                </Button>
              )}

              {isUser &&
                (profile.following ? (
                  <UnfollowUserButton profile={profile} />
                ) : (
                  <FollowUserButton profile={profile} />
                ))}

              {isCurrentUser && (
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
  );
}

type ProfileWrapperProps = { children: ReactNode };
const ProfileWrapper = (props: ProfileWrapperProps) => {
  const { children } = props;
  return (
    <div className="col-xs-12 col-md-10 offset-md-1">
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          height: '11rem',
        }}
      >
        {children}
      </div>
    </div>
  );
};
