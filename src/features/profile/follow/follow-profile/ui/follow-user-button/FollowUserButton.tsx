import { useQueryClient } from '@tanstack/react-query';
import { profileApi } from '~entities/profile';
import { useMutationFollowUser } from '../../model/followUser';

type FollowUserButtonProps = {
  queryKey: unknown[];
  profile: profileApi.Profile;
};

export function FollowUserButton(props: FollowUserButtonProps) {
  const { queryKey, profile } = props;

  const queryClient = useQueryClient();

  const followUser = useMutationFollowUser(queryKey, queryClient);

  const handleClick = () => {
    const newUser: profileApi.Profile = {
      ...profile,
      following: true,
    };
    followUser.mutate(newUser);
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
