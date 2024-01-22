import { baseUrl } from '~shared/api/realworld';
import {
  createQuery,
  declareParams,
  zodContract,
} from '~shared/lib/json-query';
import { UserDtoSchema } from './session.contracts';
import { mapUser } from './session.lib';
import { authorizationHeader } from './session.model';
import { CreateUserDto, LoginUserDto, UpdateUserDto } from './session.types';

export const currentUserQuery = createQuery({
  request: {
    url: baseUrl('/user'),
    method: 'GET',
    headers: () => ({ ...authorizationHeader() }),
  },
  response: {
    contract: zodContract(UserDtoSchema),
    mapData: ({ result }) => mapUser(result),
  },
});

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

export const updateUserMutation = createQuery({
  params: declareParams<UpdateUserDto>(),
  request: {
    url: baseUrl('/user'),
    method: 'PUT',
    headers: () => ({ ...authorizationHeader() }),
    body: (user) => ({ user }),
  },
  response: {
    contract: zodContract(UserDtoSchema),
    mapData: ({ result }) => mapUser(result),
  },
});
