import type { UpdateUserDto } from '~shared/api/api.types';
import type { UpdateUser } from './update.types';

export function transformUpdateUserToUpdateUserDto(updateUser: UpdateUser): UpdateUserDto {
  const { username, email, password, bio, image } = updateUser;
  return {
    user: { username, email, password, bio, image },
  };
}
