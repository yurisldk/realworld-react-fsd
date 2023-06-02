import { useQueryClient } from '@tanstack/react-query';
import { profileApi } from '~entities/profile';
import { useFollowUser } from '../../model/followUser';

type FollowUserButtonProps = {
  profile: profileApi.Profile;
};

export function FollowUserButton(props: FollowUserButtonProps) {
  const { profile } = props;

  const queryClient = useQueryClient();

  const toggleFollow = useFollowUser(queryClient);

  const handleClick = async () => {
    await toggleFollow.mutateAsync(profile);
  };

  return (
    <button
      className="btn btn-sm btn-outline-secondary action-btn"
      type="button"
      onClick={handleClick}
    >
      <i className="ion-plus-round" />
      &nbsp; Follow {profile.username}
    </button>
  );
}
