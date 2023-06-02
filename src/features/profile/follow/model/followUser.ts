import { QueryClient, useMutation } from '@tanstack/react-query';
import { profileApi } from '~entities/profile';
import { conduitApi } from '~shared/api';

/**
 * @see https://tanstack.com/query/v4/docs/react/guides/optimistic-updates
 */
export const useFollowUser = (queryClient: QueryClient) =>
  useMutation(
    async (profile: profileApi.Profile) =>
      conduitApi.Profile.follow(profile.username),
    {
      onMutate: async (profile) => {
        await queryClient.cancelQueries({
          queryKey: ['profile', profile.username],
        });

        const updatedProfile = {
          ...profile,
          following: true,
        };

        queryClient.setQueryData(['profile', profile.username], updatedProfile);

        return { profile, updatedProfile };
      },

      onError: (_, profile, context) => {
        queryClient.setQueryData(
          ['profile', profile.username],
          context?.profile,
        );
      },

      onSettled: (updatedProfile) => {
        queryClient.invalidateQueries({
          queryKey: ['profile', updatedProfile?.profile.username],
        });
      },
    },
  );
