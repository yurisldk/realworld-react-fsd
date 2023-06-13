import { QueryClient, useMutation } from '@tanstack/react-query';
import { profileApi } from '~entities/profile';
import { ArticleDto, realworldApi } from '~shared/api/realworld';

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
        const isArticle = queryKey[0] === 'article';

        await queryClient.cancelQueries({ queryKey });

        const prevQueryData = queryClient.getQueryData<
          ArticleDto | profileApi.Profile
        >(queryKey);

        let newQueryData: ArticleDto | profileApi.Profile | undefined;

        switch (true) {
          case isArticle:
            newQueryData = {
              ...prevQueryData,
              author: newProfile,
            } as ArticleDto;
            break;

          case !isArticle:
            newQueryData = newProfile;
            break;

          default:
            newQueryData = undefined;
        }

        queryClient.setQueryData<ArticleDto | profileApi.Profile>(
          queryKey,
          newQueryData,
        );

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
