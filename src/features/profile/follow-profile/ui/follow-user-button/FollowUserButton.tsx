import { useMutation, useQueryClient } from '@tanstack/react-query';
import { IoAdd } from 'react-icons/io5';
import { profileApi, profileTypes } from '~entities/profile';
import { Button } from '~shared/ui/button';

type FollowUserButtonProps = {
  profile: profileTypes.Profile;
  className?: string;
};

export function FollowUserButton(props: FollowUserButtonProps) {
  const { profile, className } = props;
  const queryClient = useQueryClient();
  const mutationKey = [...profileApi.FOLLOW_PROFILE_KEY, profile.username];

  const { mutate: followProfile } = useMutation({
    mutationKey: mutationKey,
    mutationFn: profileApi.followProfileMutation,
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: mutationKey });
      const newProfile: profileTypes.Profile = {
        ...profile,
        following: !profile.following,
      };
      queryClient.setQueryData(mutationKey, newProfile);
      return profile;
    },
    onError: (_error, _variables, prevProfile) => {
      if (!prevProfile) return;
      queryClient.setQueryData(mutationKey, prevProfile);
    },
    onSettled: async (_data, _error, _variables, prevProfile) => {
      if (!prevProfile) return;
      await queryClient.invalidateQueries({ queryKey: mutationKey });
    },
  });

  const handleClick = () => {
    followProfile(profile.username);
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
