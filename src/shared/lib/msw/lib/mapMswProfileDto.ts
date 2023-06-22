import { ProfileDto } from '~shared/api/realworld';
import { MaybeProfileType, MaybeUserType } from '../serverDatabase';

export function mapMswProfileDto(
  maybeUser: MaybeUserType,
  maybeProfile: MaybeProfileType,
): ProfileDto {
  let author: ProfileDto;

  const { followedBy, ...profile } = maybeProfile!;

  if (maybeUser) {
    author = { ...profile, following: followedBy.includes(maybeUser.username) };
  } else {
    author = { ...profile, following: false };
  }

  return author;
}
