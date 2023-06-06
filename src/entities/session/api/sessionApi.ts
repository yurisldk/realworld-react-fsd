import { UseQueryOptions, useQuery } from '@tanstack/react-query';
import {
  GenericErrorModelDto,
  HttpResponse,
  UserDto,
  realworldApi,
} from '~shared/api/realworld';
import { addUser } from '../model/sessionModel';

export type User = {
  email: string;
  token: string;
  username: string;
  bio: string;
  image: string;
};

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
  HttpResponse<unknown, GenericErrorModelDto>,
  User,
  string[]
>;
type UseCurrentUserOptions = Omit<UseCurrentUserQuery, 'queryKey' | 'queryFn'>;

function mapUserDto(userDto: UserDto): User {
  return { ...userDto };
}

// TODO: add DI model.addUser(user)
export const useCurrentUser = (options?: UseCurrentUserOptions) =>
  useQuery({
    queryKey: sessionKeys.session.currentUser(),
    queryFn: async ({ signal }) => {
      const response = await realworldApi.user.getCurrentUser({ signal });

      const user = mapUserDto(response.data.user);

      addUser(user);

      return user;
    },
    ...options,
  });
