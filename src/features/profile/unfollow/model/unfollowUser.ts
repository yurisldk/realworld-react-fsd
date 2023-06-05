import { QueryClient, useMutation } from '@tanstack/react-query';
import { profileApi } from '~entities/profile';
import { realworldApi } from '~shared/api/realworld';

/**
 * @see https://tanstack.com/query/v4/docs/react/guides/optimistic-updates
 */
export const useUnfollowUser = (queryClient: QueryClient) =>
  useMutation(
    async (profile: profileApi.Profile) => {
      const response = await realworldApi.profiles.unfollowUserByUsername(
        profile.username,
      );

      return response.data.profile;
    },
    {
      onMutate: async (profile) => {
        await queryClient.cancelQueries({
          queryKey: ['profile', profile.username],
        });

        const updatedProfile = {
          ...profile,
          following: false,
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
          queryKey: ['profile', updatedProfile?.username],
        });
      },
    },
  );
