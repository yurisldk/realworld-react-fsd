import { profileApi } from '~entities/profile';

type ProfileCardProps = {
  username: string;
};

export function ProfileCard(props: ProfileCardProps) {
  const { username } = props;

  const {
    data: profile,
    isLoading,
    isError,
    isSuccess,
  } = profileApi.useProfile(username);

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
