import { UseMutationOptions, useMutation } from '@tanstack/react-query';
import { sessionApi } from '~entities/session';
import {
  HttpResponse,
  UserDto,
  NewUserDto,
  realworldApi,
  GenericErrorModel,
} from '~shared/api/realworld';

type UseCreateUserMutation = UseMutationOptions<
  HttpResponse<{ user: UserDto }, unknown>,
  GenericErrorModel,
  NewUserDto,
  unknown
>;

type UseCreateUserOptions = Omit<
  UseCreateUserMutation,
  'mutationKey' | 'mutationFn'
>;

export const useCreateUser = (options?: UseCreateUserOptions) =>
  useMutation({
    mutationKey: sessionApi.sessionKeys.mutation.create(),
    mutationFn: (user: NewUserDto) => realworldApi.users.createUser({ user }),
    ...options,
  });
