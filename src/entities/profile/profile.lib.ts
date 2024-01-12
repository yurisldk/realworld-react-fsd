import { Profile, ProfileDto } from './profie.types';

export function mapProfile(profileDto: ProfileDto): Profile {
  return profileDto.profile;
}
