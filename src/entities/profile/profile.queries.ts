import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  followProfileMutation,
  profileQuery,
  unfollowProfileMutation,
} from './profie.api';
import { Profile } from './profie.types';

export const profileKeys = {
  root: ['profile'] as const,
  profile(username: string) {
    return [...profileKeys.root, username] as const;
  },
  follow(username: string) {
    return [...profileKeys.profile(username), 'follow'] as const;
  },
  unfollow(username: string) {
    return [...profileKeys.profile(username), 'unfollow'] as const;
  },
};

export function useProfileQuery(username: string) {
  return useQuery({
    queryKey: profileKeys.profile(username),
    queryFn: () => profileQuery(username),
  });
}

export function useFollowProfileMutation(profile: Profile) {
  const queryClient = useQueryClient();

  const mutationKey = profileKeys.follow(profile.username);
  const profileKey = profileKeys.profile(profile.username);

  return useMutation({
    mutationKey,
    mutationFn: followProfileMutation,
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: profileKey });
      const newProfile: Profile = {
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

export function useUnfollowProfileMutation(profile: Profile) {
  const queryClient = useQueryClient();

  const mutationKey = profileKeys.follow(profile.username);
  const profileKey = profileKeys.profile(profile.username);

  return useMutation({
    mutationKey,
    mutationFn: unfollowProfileMutation,
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: profileKey });

      const newProfile: Profile = {
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
