import { profileTypesDto } from '~shared/api/profile'
import { Profile } from './profie.types'

export function transformProfileDtoToProfile(
  profileDto: profileTypesDto.ProfileDto,
): Profile {
  const { profile } = profileDto

  return {
    ...profile,
    bio: profile.bio || '',
  }
}
