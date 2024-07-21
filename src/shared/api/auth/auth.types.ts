import { z } from 'zod'
import {
  CreateUserDtoSchema,
  LoginUserDtoSchema,
  UpdateUserDtoSchema,
  UserDtoSchema,
} from './auth.contracts'

export type UserDto = z.infer<typeof UserDtoSchema>
export type UpdateUserDto = z.infer<typeof UpdateUserDtoSchema>
export type CreateUserDto = z.infer<typeof CreateUserDtoSchema>
export type LoginUserDto = z.infer<typeof LoginUserDtoSchema>
