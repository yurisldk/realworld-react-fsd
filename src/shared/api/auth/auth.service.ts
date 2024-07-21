import { handleMutationIssue } from '~shared/lib/error'
import { createJsonMutation, createJsonQuery } from '../../lib/fetch'
import { getUrl, authHeaderService } from '../api.service'
import { UserDtoSchema } from './auth.contracts'
import { CreateUserDto, LoginUserDto, UpdateUserDto } from './auth.types'

export class AuthService {
  static currentUserQuery(signal?: AbortSignal) {
    return createJsonQuery({
      request: {
        url: getUrl('/user'),
        method: 'GET',
        headers: authHeaderService.getHeader(),
      },
      response: { contract: UserDtoSchema },
      abort: signal,
    })
  }

  static createUserMutation(params: { user: CreateUserDto }) {
    return createJsonMutation({
      request: {
        url: getUrl('/users'),
        method: 'POST',
        body: JSON.stringify({ user: params.user }),
      },
      response: { contract: UserDtoSchema },
    })
      .then((data) => {
        authHeaderService.setHeader(data.user.token)
        return data
      })
      .catch((e) => {
        throw handleMutationIssue(e)
      })
  }

  static loginUserMutation(params: { user: LoginUserDto }) {
    return createJsonMutation({
      request: {
        url: getUrl('/users/login'),
        method: 'POST',
        body: JSON.stringify({ user: params.user }),
      },
      response: { contract: UserDtoSchema },
    })
      .then((data) => {
        authHeaderService.setHeader(data.user.token)
        return data
      })
      .catch((e) => {
        throw handleMutationIssue(e)
      })
  }

  static logoutUserMutation() {
    return Promise.resolve().then(() => authHeaderService.resetHeader())
  }

  static updateUserMutation(params: { user: UpdateUserDto }) {
    return createJsonMutation({
      request: {
        url: getUrl('/user'),
        method: 'PUT',
        headers: authHeaderService.getHeader(),
        body: JSON.stringify({ user: params.user }),
      },
      response: { contract: UserDtoSchema },
    })
      .then((data) => {
        authHeaderService.setHeader(data.user.token)
        return data
      })
      .catch((e) => {
        throw handleMutationIssue(e)
      })
  }
}
