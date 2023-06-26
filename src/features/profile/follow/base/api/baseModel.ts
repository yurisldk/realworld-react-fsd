import { QueryClient, useMutation } from '@tanstack/react-query';
import { articleApi } from '~entities/article';
import { profileApi } from '~entities/profile';
import {
  ArticleDto,
  GenericErrorModel,
  ProfileDto,
  realworldApi,
} from '~shared/api/realworld';

type MutateFnType = typeof realworldApi.profiles.followUserByUsername;

export const useMutateFollowUser = (
  mutateFn: MutateFnType,
  queryClient: QueryClient,
) =>
  // We have to optimistic update profile as part of article and profile to avoid desynchronize when user follow profile then instant switch beetwen article page and profile page and have old state before our query refetched.
  useMutation<
    ProfileDto,
    GenericErrorModel,
    profileApi.Profile,
    {
      profileQueryKey: string[];
      articleQueryKey: string[];
      prevProfile: ProfileDto;
    }
  >(
    async (profile: profileApi.Profile) => {
      const response = await mutateFn(profile.username);
      return response.data.profile;
    },

    {
      onMutate: async (newProfile) => {
        const articleQueryKey = articleApi.articleKeys.article.root;
        const profileQueryKey = profileApi.profileKeys.profile.username(
          newProfile.username,
        );

        // Cancel any profile and article with slug refetches
        await queryClient.cancelQueries({ queryKey: articleQueryKey });
        await queryClient.cancelQueries({ queryKey: profileQueryKey });

        // Snapshot the previous article
        const prevProfile: ProfileDto = {
          ...newProfile,
          following: !newProfile.following,
        };

        // Optimistically update to the new value
        queryClient.setQueriesData<ArticleDto>(
          articleQueryKey,
          /* c8 ignore start */
          (prevArticle) => {
            if (!prevArticle) return undefined;
            return prevArticle.author.username === newProfile.username
              ? { ...prevArticle, author: newProfile }
              : prevArticle;
          },
          /* c8 ignore end */
        );

        queryClient.setQueryData(profileQueryKey, newProfile);

        // Return a context object with the snapshotted value and query keys
        return { profileQueryKey, articleQueryKey, prevProfile };
      },

      // If the mutation fails,
      // use the context returned from onMutate to roll back
      onError: (_error, _variables, context) => {
        if (!context) return;

        const { profileQueryKey, articleQueryKey, prevProfile } = context;

        queryClient.setQueriesData<ArticleDto>(
          articleQueryKey,
          /* c8 ignore start */
          (newArticle) => {
            if (!newArticle) return undefined;
            return newArticle.author.username === prevProfile.username
              ? { ...newArticle, author: prevProfile }
              : newArticle;
          },
          /* c8 ignore end */
        );

        queryClient.setQueryData(profileQueryKey, prevProfile);
      },

      // Always refetch after error or success:
      onSettled: (_data, _error, _variables, context) => {
        if (!context) return;

        const { profileQueryKey, articleQueryKey } = context;

        queryClient.invalidateQueries({ queryKey: articleQueryKey });
        queryClient.invalidateQueries({ queryKey: profileQueryKey });
      },
    },
  );
