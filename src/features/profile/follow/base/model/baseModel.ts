import { QueryClient, useMutation } from '@tanstack/react-query';
import { profileApi } from '~entities/profile';
import { realworldApi } from '~shared/api/realworld';

type MutateFnType = typeof realworldApi.profiles.followUserByUsername;

export const useMutateFollowUser = (
  queryKey: unknown[],
  mutateFn: MutateFnType,
  queryClient: QueryClient,
) =>
  useMutation(
    async (profile: profileApi.Profile) => {
      const response = await mutateFn(profile.username);
      return response.data.profile;
    },

    {
      onMutate: async (newProfile) => {
        await queryClient.cancelQueries({ queryKey });

        const prevQueryData =
          queryClient.getQueryData<profileApi.Profile>(queryKey);

        queryClient.setQueryData<profileApi.Profile>(queryKey, newProfile);

        return { prevQueryData };
      },

      onError: (_, __, context) => {
        if (!context) return;
        queryClient.setQueryData(queryKey, context.prevQueryData);
      },

      onSettled: () => {
        queryClient.invalidateQueries({ queryKey });
      },
    },
  );
