import type { LoginUserDto } from '~shared/api/api.types';
import type { LoginUser } from './login.types';

export function transformLoginUserToLoginUserDto(loginUser: LoginUser): LoginUserDto {
  const { email, password } = loginUser;
  return {
    user: { email, password },
  };
}
