import { baseUrl } from '~shared/api/realworld';
import { createJsonMutation, createJsonQuery } from '~shared/lib/fetch';
import { zodContract } from '~shared/lib/zod';
import { UserDtoSchema } from './session.contracts';
import { mapUser } from './session.lib';
import { authorizationHeader } from './session.model';
import { CreateUserDto, LoginUserDto, UpdateUserDto } from './session.types';

export async function currentUserQuery(signal?: AbortSignal) {
  return createJsonQuery({
    request: {
      url: baseUrl('/user'),
      method: 'GET',
      headers: { ...authorizationHeader() },
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
      url: baseUrl('/users'),
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
      url: baseUrl('/users/login'),
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
      url: baseUrl('/user'),
      method: 'PUT',
      headers: { ...authorizationHeader() },
      body: JSON.stringify({ user: params.user }),
    },
    response: {
      contract: zodContract(UserDtoSchema),
      mapData: mapUser,
    },
  });
}
