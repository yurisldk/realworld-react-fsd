import { useQueryClient } from '@tanstack/react-query';
import { IoRemove } from 'react-icons/io5';
import { profileApi } from '~entities/profile';
import { Button } from '~shared/ui/button';
import { useMutationUnfollowUser } from '../../api/unfollowUser';

type UnfollowUserButtonProps = {
  profile: profileApi.Profile;
  className?: string;
};

export function UnfollowUserButton(props: UnfollowUserButtonProps) {
  const { profile, className } = props;

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
    <Button color="secondary" onClick={handleClick} className={className}>
      <IoRemove size={16} />
      &nbsp; Unfollow {profile.username}
    </Button>
  );
}
