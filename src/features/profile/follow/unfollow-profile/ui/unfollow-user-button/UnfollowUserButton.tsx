import { useQueryClient } from '@tanstack/react-query';
import { profileApi } from '~entities/profile';
import { useMutationUnfollowUser } from '../../model/unfollowUser';

type UnfollowUserButtonProps = {
  queryKey: unknown[];
  profile: profileApi.Profile;
};

export function UnfollowUserButton(props: UnfollowUserButtonProps) {
  const { queryKey, profile } = props;

  const queryClient = useQueryClient();

  const toggleFollow = useMutationUnfollowUser(queryKey, queryClient);

  const handleClick = () => {
    const newUser: profileApi.Profile = {
      ...profile,
      following: false,
    };
    toggleFollow.mutate(newUser);
  };

  return (
    <button
      className="btn btn-sm btn-secondary action-btn"
      type="button"
      onClick={handleClick}
    >
      <i className="ion-minus-round" />
      &nbsp; Unfollow {profile.username}
    </button>
  );
}
