import { User, UserDto } from './session.types';

export function mapUser(userDto: UserDto): User {
  return userDto.user;
}
