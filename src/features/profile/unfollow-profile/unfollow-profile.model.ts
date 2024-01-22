import { useMutation, useQueryClient } from '@tanstack/react-query';
import { profileApi, profileTypes } from '~entities/profile';

export function useUnfollowProfileMutation(profile: profileTypes.Profile) {
  const queryClient = useQueryClient();

  const profileKey = [...profileApi.PROFILE_KEY, profile.username];

  return useMutation({
    mutationKey: [...profileApi.FOLLOW_PROFILE_KEY, profile.username],
    mutationFn: profileApi.unfollowProfileMutation,
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: profileKey });

      const newProfile: profileTypes.Profile = {
        ...profile,
        following: !profile.following,
      };

      queryClient.setQueryData(profileKey, newProfile);

      return profile;
    },
    onError: (_error, _variables, prevProfile) => {
      if (!prevProfile) return;
      queryClient.setQueryData(profileKey, prevProfile);
    },
    onSettled: async (_data, _error, _variables, prevProfile) => {
      if (!prevProfile) return;
      await queryClient.invalidateQueries({ queryKey: profileKey });
    },
  });
}
