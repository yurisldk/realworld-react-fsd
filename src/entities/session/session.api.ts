/* eslint-disable no-param-reassign */
import { baseUrl } from '~shared/api/realworld';
import {
  createQuery,
  declareParams,
  zodContract,
} from '~shared/lib/json-query';
import { UserDtoSchema } from './session.contracts';
import { mapUser } from './session.lib';
import { authorization } from './session.model';
import { CreateUserDto, LoginUserDto, UpdateUserDto } from './session.types';

export const CURRENT_USER_KEY = ['session', 'currentUser'];
export const currentUserQuery = createQuery({
  request: {
    url: baseUrl('/user'),
    method: 'GET',
    headers: (headers) => {
      headers.Authorization = authorization.accessToken;
    },
  },
  response: {
    contract: zodContract(UserDtoSchema),
    mapData: ({ result }) => mapUser(result),
  },
});

export const CREATE_USER_KEY = ['session', 'createUser'];
export const createUserMutation = createQuery({
  params: declareParams<CreateUserDto>(),
  request: {
    url: baseUrl('/users'),
    method: 'POST',
    body: (user) => ({ user }),
  },
  response: {
    contract: zodContract(UserDtoSchema),
    mapData: ({ result }) => mapUser(result),
  },
});

export const LOGIN_USER_KEY = ['session', 'loginUser'];
export const loginUserMutation = createQuery({
  params: declareParams<LoginUserDto>(),
  request: {
    url: baseUrl('/users/login'),
    method: 'POST',
    body: (user) => ({ user }),
  },
  response: {
    contract: zodContract(UserDtoSchema),
    mapData: ({ result }) => mapUser(result),
  },
});

export const UPDATE_USER_KEY = ['session', 'updateUser'];
export const updateUserMutation = createQuery({
  params: declareParams<UpdateUserDto>(),
  request: {
    url: baseUrl('/user'),
    method: 'PUT',
    headers: (headers) => {
      headers.Authorization = authorization.accessToken;
    },
    body: (user) => ({ user }),
  },
  response: {
    contract: zodContract(UserDtoSchema),
    mapData: ({ result }) => mapUser(result),
  },
});
