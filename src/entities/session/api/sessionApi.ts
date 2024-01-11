import { UseQueryOptions, useQuery } from '@tanstack/react-query';
import {
  GenericErrorModel,
  RequestParams,
  UserDto,
  realworldApi,
} from '~shared/api/realworld';
import { addUser } from '../model/sessionModel';

export interface User {
  email: string;
  token: string;
  username: string;
  bio: string;
  image: string;
}

function mapUser(userDto: UserDto): User {
  return userDto;
}

export const sessionKeys = {
  session: {
    root: ['session'],
    currentUser: () => [...sessionKeys.session.root, 'currentUser'],
  },

  mutation: {
    login: () => [...sessionKeys.session.root, 'login'],
    create: () => [...sessionKeys.session.root, 'create'],
  },
};

type UseCurrentUserQuery = UseQueryOptions<
  User,
  GenericErrorModel,
  User,
  string[]
>;
type UseCurrentUserOptions = Omit<UseCurrentUserQuery, 'queryKey' | 'queryFn'>;

export const useCurrentUser = (
  options?: UseCurrentUserOptions,
  params?: RequestParams,
) =>
  useQuery({
    queryKey: sessionKeys.session.currentUser(),
    queryFn: async ({ signal }) => {
      const response = await realworldApi.user.getCurrentUser({
        signal,
        ...params,
      });

      const user = mapUser(response.data.user);

      addUser(user);

      return user;
    },
    ...options,
  });

// function baseUrl(path: string) {
//   return `https://api.realworld.io/api${path}`;
// }

// const currentUserQuery = async () => {
//   const response = await fetch(baseUrl('/user'), { method: 'GET' });

//   try {
//     const parsedJson = await response.json();
//     return parsedJson;
//   } catch (e) {
//     throw preparationError({ reason: 'Response is not JSON' });
//   }
// };
