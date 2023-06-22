import { useQueryClient } from '@tanstack/react-query';
import { FollowButton, profileApi } from '~entities/profile';
import { useMutationFollowUser } from '../../api/followUser';

type FollowUserButtonProps = {
  profile: profileApi.Profile;
};

export function FollowUserButton(props: FollowUserButtonProps) {
  const { profile } = props;

  const queryClient = useQueryClient();

  const followUser = useMutationFollowUser(queryClient);

  const handleClick = () => {
    const newUser: profileApi.Profile = {
      ...profile,
      following: true,
    };
    followUser.mutate(newUser);
  };

  return <FollowButton title={profile.username} onClick={handleClick} />;
}
