import { UseQueryOptions, useQuery } from '@tanstack/react-query';
import { ProfileDto, realworldApi } from '~shared/api/realworld';

export type Profile = {
  username: string;
  bio: string;
  image: string;
  following: boolean;
};

type UseProfileOptions = UseQueryOptions<Profile, unknown, Profile, string[]>;

function mapProfileDto(profileDto: ProfileDto): Profile {
  return { ...profileDto };
}

export function useProfile(
  profile: string,
  options?: UseProfileOptions,
  secure?: boolean,
) {
  return useQuery(
    ['profile', profile],
    async ({ signal }) => {
      const response = await realworldApi.profiles.getProfileByUsername(
        profile,
        { signal, secure },
      );

      return mapProfileDto(response.data.profile);
    },
    options,
  );
}
