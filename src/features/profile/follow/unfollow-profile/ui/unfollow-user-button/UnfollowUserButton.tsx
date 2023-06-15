import { useQueryClient } from '@tanstack/react-query';
import { FollowButton, profileApi } from '~entities/profile';
import { useMutationUnfollowUser } from '../../model/unfollowUser';

type UnfollowUserButtonProps = {
  profile: profileApi.Profile;
};

export function UnfollowUserButton(props: UnfollowUserButtonProps) {
  const { profile } = props;

  const queryClient = useQueryClient();

  const toggleFollow = useMutationUnfollowUser(queryClient);

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
