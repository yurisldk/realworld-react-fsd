import type { RegisterUserDto } from '~shared/api/api.types';
import type { RegisterUser } from './register.types';

export function transformRegisterUserToRegisterUserDto(registerUser: RegisterUser): RegisterUserDto {
  const { username, email, password } = registerUser;
  return {
    user: { username, email, password },
  };
}
