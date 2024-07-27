import { authTypesDto } from '~shared/api/auth'
import { Session } from './session.types'

export function transformUserDtoToSession(
  userDto: authTypesDto.UserDto,
): Session {
  const { user } = userDto
  return {
    email: user.email,
    image: user.image,
    token: user.token,
    username: user.username,
    bio: user?.bio || '',
  }
}
