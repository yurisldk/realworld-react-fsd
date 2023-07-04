import { useQueryClient } from '@tanstack/react-query';
import { IoAdd } from 'react-icons/io5';
import { profileApi } from '~entities/profile';
import { Button } from '~shared/ui/button';
import { useMutationFollowUser } from '../../api/followUser';

type FollowUserButtonProps = {
  profile: profileApi.Profile;
  className?: string;
};

export function FollowUserButton(props: FollowUserButtonProps) {
  const { profile, className } = props;

  const queryClient = useQueryClient();

  const followUser = useMutationFollowUser(queryClient);

  const handleClick = () => {
    const newUser: profileApi.Profile = {
      ...profile,
      following: true,
    };
    followUser.mutate(newUser);
  };

  return (
    <Button
      color="secondary"
      variant="outline"
      className={className}
      onClick={handleClick}
    >
      <IoAdd size={16} />
      &nbsp; Follow {profile.username}
    </Button>
  );
}
