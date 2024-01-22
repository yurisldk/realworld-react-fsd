import { useMutation, useQueryClient } from '@tanstack/react-query';
import { profileApi, profileTypes } from '~entities/profile';

export function useUnfollowProfileMutation(profile: profileTypes.Profile) {
  const queryClient = useQueryClient();

  const mutationKey = [...profileApi.FOLLOW_PROFILE_KEY, profile.username];

  return useMutation({
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
}
