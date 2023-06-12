import { UseQueryOptions, useQuery } from '@tanstack/react-query';
import {
  GenericErrorModel,
  RequestParams,
  realworldApi,
} from '~shared/api/realworld';

export type Profile = {
  username: string;
  bio: string;
  image: string;
  following: boolean;
};

export const profileKeys = {
  profile: {
    root: ['profile'],
    username: (username: string) => [...profileKeys.profile.root, username],
  },
};

type UseProfileQuery = UseQueryOptions<
  Profile,
  GenericErrorModel,
  Profile,
  string[]
>;
type UseProfileQueryOptions = Omit<UseProfileQuery, 'queryKey' | 'queryFn'>;

export function useProfile(
  username: string,
  params?: RequestParams,
  options?: UseProfileQueryOptions,
) {
  return useQuery({
    queryKey: profileKeys.profile.username(username),
    queryFn: async ({ signal }) => {
      const response = await realworldApi.profiles.getProfileByUsername(
        username,
        { signal, ...params },
      );

      return { ...response.data.profile };
    },
    ...options,
  });
}
