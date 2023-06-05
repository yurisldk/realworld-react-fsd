import {
  UseMutationOptions,
  UseQueryOptions,
  useMutation,
  useQuery,
} from '@tanstack/react-query';
import {
  GenericErrorModelDto,
  HttpResponse,
  LoginUserDto,
  NewUserDto,
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

type UseCurrentUserOptions = UseQueryOptions<User, unknown, User, string[]>;

function mapUserDto(userDto: UserDto): User {
  return { ...userDto };
}

// TODO: add DI model.addUser(user)
export const useCurrentUser = (options?: UseCurrentUserOptions) =>
  useQuery(
    ['currentUser'],
    async ({ signal }) => {
      const response = await realworldApi.user.getCurrentUser({ signal });

      const user = mapUserDto(response.data.user);

      addUser(user);

      return user;
    },
    options,
  );

type UseRegisterUserMutation = UseMutationOptions<
  HttpResponse<{ user: UserDto }, unknown>,
  HttpResponse<unknown, GenericErrorModelDto>,
  NewUserDto,
  unknown
>;
type UseRegisterUserOptions = Omit<
  UseRegisterUserMutation,
  'mutationKey' | 'mutationFn'
>;

// TODO: move to features
export const useRegisterUser = (options?: UseRegisterUserOptions) =>
  useMutation(
    (user: NewUserDto): Promise<HttpResponse<{ user: UserDto }, unknown>> =>
      realworldApi.users.createUser({ user }),
    options,
  );

type UseLoginUserOptions = UseMutationOptions<
  HttpResponse<{ user: UserDto }, GenericErrorModelDto>,
  unknown,
  LoginUserDto,
  unknown
>;

export const useLoginUser = (oprions?: UseLoginUserOptions) =>
  useMutation(
    (user: LoginUserDto) => realworldApi.users.login({ user }),
    oprions,
  );
