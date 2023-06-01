import {
  UseMutationOptions,
  UseQueryOptions,
  useMutation,
  useQuery,
} from '@tanstack/react-query';
import { conduitApi } from '~shared/api';

export type User = {
  email: string;
  token: string;
  username: string;
  bio?: string;
  image?: string;
};

type UseCurrentUserOptions = UseQueryOptions<User, unknown, User, string[]>;

function mapUserDto(userDto: conduitApi.UserDto): User {
  // @ts-expect-error
  return {
    ...userDto.user,
    ...(!userDto.user.bio && { bio: undefined }),
    ...(!userDto.user.image && { image: undefined }),
  };
}

export const useCurrentUser = (options?: UseCurrentUserOptions) =>
  useQuery(
    ['currentUser'],
    async ({ signal }) => {
      const userDto = await conduitApi.Auth.сurrentUser(signal);
      return mapUserDto(userDto);
    },
    options,
  );

type UseRegisterUserOptions = UseMutationOptions<
  conduitApi.UserDto,
  unknown,
  conduitApi.RegisterData,
  unknown
>;

export const useRegisterUser = (options?: UseRegisterUserOptions) =>
  useMutation(
    (data: conduitApi.RegisterData) => conduitApi.Auth.register(data),
    options,
  );

type UseLoginUserOptions = UseMutationOptions<
  conduitApi.UserDto,
  unknown,
  conduitApi.LoginData,
  unknown
>;

export const useLoginUser = (options?: UseLoginUserOptions) =>
  useMutation(
    (userData: conduitApi.LoginData) => conduitApi.Auth.login(userData),
    options,
  );
