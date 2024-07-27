import { AxiosContracts } from '../../lib/axios'
import { realworld } from '../index'
import {
  CreateUserDtoSchema,
  LoginUserDtoSchema,
  UpdateUserDtoSchema,
  UserDtoSchema,
} from './auth.contracts'
import { CreateUserDto, LoginUserDto, UpdateUserDto } from './auth.types'

export class AuthService {
  static currentUserQuery(config: { signal?: AbortSignal }) {
    return realworld
      .get('/user', config)
      .then(AxiosContracts.responseContract(UserDtoSchema))
  }

  static createUserMutation(data: { createUserDto: CreateUserDto }) {
    const createUserDto = AxiosContracts.requestContract(
      CreateUserDtoSchema,
      data.createUserDto,
    )
    return realworld
      .post('/users', { user: createUserDto })
      .then(AxiosContracts.responseContract(UserDtoSchema))
  }

  static loginUserMutation(data: { loginUserDto: LoginUserDto }) {
    const loginUserDto = AxiosContracts.requestContract(
      LoginUserDtoSchema,
      data.loginUserDto,
    )
    return realworld
      .post('/users/login', { user: loginUserDto })
      .then(AxiosContracts.responseContract(UserDtoSchema))
  }

  static logoutUserMutation() {
    return Promise.resolve()
  }

  static updateUserMutation(data: { updateUserDto: UpdateUserDto }) {
    const updateUserDto = AxiosContracts.requestContract(
      UpdateUserDtoSchema,
      data.updateUserDto,
    )
    return realworld
      .put('/user', { user: updateUserDto })
      .then(AxiosContracts.responseContract(UserDtoSchema))
  }
}
