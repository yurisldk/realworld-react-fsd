import { useQuery } from '@tanstack/react-query';
import { conduitApi } from '~shared/api';

type Profile = {
  username: string;
  bio: string;
  image: string;
  following: boolean;
};

function mapProfileDto(
  profileDto: Record<'profile', conduitApi.ProfileDto>,
): Profile {
  return {
    ...profileDto.profile,
  };
}

export function useProfile(profile: string) {
  return useQuery(['profile', profile], async () => {
    const profileDto = await conduitApi.Profile.profile(profile);
    return mapProfileDto(profileDto);
  });
}
