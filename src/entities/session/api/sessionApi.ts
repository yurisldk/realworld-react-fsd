import {
  UseMutationOptions,
  UseQueryOptions,
  useMutation,
  useQuery,
} from '@tanstack/react-query';
import { conduitApi } from '~shared/api';

type UseCurrentUserOptions = UseQueryOptions<
  conduitApi.UserDto,
  unknown,
  conduitApi.UserDto,
  string[]
>;

export const useCurrentUser = (options?: UseCurrentUserOptions) =>
  useQuery(['currentUser'], async () => conduitApi.Auth.сurrentUser(), options);

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
