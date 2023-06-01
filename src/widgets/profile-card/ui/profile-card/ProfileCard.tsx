import { useQueryClient } from '@tanstack/react-query';
import { profileApi } from '~entities/profile';
import { sessionModel } from '~entities/session';

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
  } = profileApi.useProfile(username, { enabled: !isCurrentUser });

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
  );
}
