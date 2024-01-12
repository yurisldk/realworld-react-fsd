import { useMutation, useQueryClient } from '@tanstack/react-query';
import { IoRemove } from 'react-icons/io5';
import { profileApi, profileTypes } from '~entities/profile';
import { Button } from '~shared/ui/button';

type UnfollowUserButtonProps = {
  profile: profileTypes.Profile;
  className?: string;
};

export function UnfollowUserButton(props: UnfollowUserButtonProps) {
  const { profile, className } = props;
  const queryClient = useQueryClient();
  const mutationKey = [...profileApi.UNFOLLOW_PROFILE_KEY, profile.username];

  const { mutate: unfollowProfile } = useMutation({
    mutationKey: mutationKey,
    mutationFn: profileApi.unfollowProfileMutation,
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
    unfollowProfile(profile.username);
  };

  return (
    <Button color="secondary" onClick={handleClick} className={className}>
      <IoRemove size={16} />
      &nbsp; Unfollow {profile.username}
    </Button>
  );
}
