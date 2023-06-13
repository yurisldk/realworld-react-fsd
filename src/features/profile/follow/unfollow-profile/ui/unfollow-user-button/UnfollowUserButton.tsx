import { useQueryClient } from '@tanstack/react-query';
import { FollowButton, profileApi } from '~entities/profile';
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
    <FollowButton title={profile.username} following onClick={handleClick} />
  );
}
