import { useQueryClient } from '@tanstack/react-query';
import { profileApi } from '~entities/profile';
import { useUnfollowUser } from '../../model/unfollowUser';

type UnfollowUserButtonProps = {
  profile: profileApi.Profile;
};

export function UnfollowUserButton(props: UnfollowUserButtonProps) {
  const { profile } = props;

  const queryClient = useQueryClient();

  const toggleFollow = useUnfollowUser(queryClient);

  const handleClick = async () => {
    await toggleFollow.mutateAsync(profile);
  };

  return (
    <button
      className="btn btn-sm btn-secondary action-btn"
      type="button"
      onClick={handleClick}
    >
      <i className="ion-minus-round" />
      &nbsp; Follow {profile.username}
    </button>
  );
}
