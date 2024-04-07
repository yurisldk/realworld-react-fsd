import { authHeaderService, urlService } from '~shared/api';
import { createJsonMutation, createJsonQuery } from '~shared/lib/fetch';
import { zodContract } from '~shared/lib/zod';
import { UserDtoSchema } from './session.contracts';
import { mapUser } from './session.lib';
import { CreateUserDto, LoginUserDto, UpdateUserDto } from './session.types';

export async function currentUserQuery(signal?: AbortSignal) {
  return createJsonQuery({
    request: {
      url: urlService.getUrl('/user'),
      method: 'GET',
      headers: { ...authHeaderService.getHeader() },
    },
    response: {
      contract: zodContract(UserDtoSchema),
      mapData: mapUser,
    },
    abort: signal,
  });
}

export async function createUserMutation(params: { user: CreateUserDto }) {
  return createJsonMutation({
    request: {
      url: urlService.getUrl('/users'),
      method: 'POST',
      body: JSON.stringify({ user: params.user }),
    },
    response: {
      contract: zodContract(UserDtoSchema),
      mapData: mapUser,
    },
  });
}

export async function loginUserMutation(params: { user: LoginUserDto }) {
  return createJsonMutation({
    request: {
      url: urlService.getUrl('/users/login'),
      method: 'POST',
      body: JSON.stringify({ user: params.user }),
    },
    response: {
      contract: zodContract(UserDtoSchema),
      mapData: mapUser,
    },
  });
}

export async function updateUserMutation(params: { user: UpdateUserDto }) {
  return createJsonMutation({
    request: {
      url: urlService.getUrl('/user'),
      method: 'PUT',
      headers: { ...authHeaderService.getHeader() },
      body: JSON.stringify({ user: params.user }),
    },
    response: {
      contract: zodContract(UserDtoSchema),
      mapData: mapUser,
    },
  });
}
