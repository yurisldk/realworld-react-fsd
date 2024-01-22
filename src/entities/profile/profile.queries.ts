import {
  queryOptions as tsqQueryOptions,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query';
// eslint-disable-next-line no-restricted-imports
import { Article } from '~entities/article/@x/profile';
import { queryClient } from '~shared/lib/react-query';
import {
  followProfileMutation,
  profileQuery,
  unfollowProfileMutation,
} from './profie.api';
import { Profile } from './profie.types';

const keys = {
  root: () => {
    return ['profile'] as const;
  },
  profile(username: string) {
    return [...keys.root(), 'byUsername', username] as const;
  },
  follow(username: string) {
    return [...keys.root(), 'follow', username] as const;
  },
  unfollow(username: string) {
    return [...keys.root(), 'unfollow', username] as const;
  },
};

export const profileService = {
  queryKey: (username: string) => keys.profile(username),

  getCache: (username: string) =>
    queryClient.getQueryData<Profile>(profileService.queryKey(username)),

  setCache: (profile: Profile) =>
    queryClient.setQueryData(
      profileService.queryKey(profile.username),
      profile,
    ),

  removeCache: (username: string) =>
    queryClient.removeQueries({ queryKey: keys.profile(username) }),

  queryOptions: (username: string) => {
    const profileKey = profileService.queryKey(username);
    return tsqQueryOptions({
      queryKey: profileKey,
      queryFn: async () => profileQuery(username),
      initialData: () => profileService.getCache(username)!,
      initialDataUpdatedAt: () =>
        queryClient.getQueryState(profileKey)?.dataUpdatedAt,
    });
  },

  prefetchQuery: async (username: string) =>
    queryClient.prefetchQuery(profileService.queryOptions(username)),
};

export function useFollowProfileMutation(username: string) {
  const queryClient = useQueryClient();

  const followKey = keys.follow(username);
  const profileKey = keys.profile(username);
  const articleKey = ['article', 'bySlug'];

  return useMutation({
    mutationKey: followKey,
    mutationFn: followProfileMutation,
    onMutate: async (username) => {
      await queryClient.cancelQueries({ queryKey: profileKey });
      await queryClient.cancelQueries({ queryKey: articleKey });

      const oldProfileData = profileService.getCache(username);

      const newProfileData = oldProfileData && {
        ...oldProfileData,
        following: !oldProfileData.following,
      };

      if (newProfileData) {
        profileService.setCache(newProfileData);
      }

      queryClient.setQueriesData<Article>(
        { queryKey: articleKey },
        (article) => {
          if (!article) return;
          if (!newProfileData) return;
          if (article.author.username !== newProfileData.username) {
            return article;
          }
          return { ...article, author: newProfileData };
        },
      );

      return { oldProfileData };
    },
    onError: (_error, _variables, context) => {
      if (!context || !context.oldProfileData) return;
      profileService.setCache(context.oldProfileData);

      queryClient.setQueriesData<Article>(
        { queryKey: articleKey },
        (article) => {
          if (!article) return;
          if (!context.oldProfileData) return;
          if (article.author.username !== context.oldProfileData.username) {
            return article;
          }
          return { ...article, author: context.oldProfileData };
        },
      );
    },
    onSettled: async () => {
      await queryClient.invalidateQueries({ queryKey: profileKey });
      await queryClient.invalidateQueries({ queryKey: articleKey });
    },
  });
}

export function useUnfollowProfileMutation(username: string) {
  const queryClient = useQueryClient();

  const unfollowKey = keys.unfollow(username);
  const profileKey = keys.profile(username);
  const articleKey = ['article', 'bySlug'];

  return useMutation({
    mutationKey: unfollowKey,
    mutationFn: unfollowProfileMutation,
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: profileKey });
      await queryClient.cancelQueries({ queryKey: articleKey });

      const oldProfileData = profileService.getCache(username);

      const newProfileData = oldProfileData && {
        ...oldProfileData,
        following: !oldProfileData.following,
      };

      if (newProfileData) {
        profileService.setCache(newProfileData);
      }

      queryClient.setQueriesData<Article>(
        { queryKey: articleKey },
        (article) => {
          if (!article) return;
          if (!newProfileData) return;
          if (article.author.username !== newProfileData.username) {
            return article;
          }
          return { ...article, author: newProfileData };
        },
      );

      return { oldProfileData };
    },
    onError: (_error, _variables, context) => {
      if (!context || !context.oldProfileData) return;
      profileService.setCache(context.oldProfileData);

      queryClient.setQueriesData<Article>(
        { queryKey: articleKey },
        (article) => {
          if (!article) return;
          if (!context.oldProfileData) return;
          if (article.author.username !== context.oldProfileData.username) {
            return article;
          }
          return { ...article, author: context.oldProfileData };
        },
      );
    },
    onSettled: async () => {
      await queryClient.invalidateQueries({ queryKey: profileKey });
      await queryClient.invalidateQueries({ queryKey: articleKey });
    },
  });
}
