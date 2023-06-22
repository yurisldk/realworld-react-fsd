import { UseMutationOptions, useMutation } from '@tanstack/react-query';
import { sessionApi } from '~entities/session';
import {
  HttpResponse,
  UserDto,
  LoginUserDto,
  realworldApi,
  GenericErrorModel,
} from '~shared/api/realworld';

type UseLoginUserMutation = UseMutationOptions<
  HttpResponse<{ user: UserDto }, unknown>,
  GenericErrorModel,
  LoginUserDto,
  unknown
>;

type UseLoginUserOptions = Omit<
  UseLoginUserMutation,
  'mutationFn' | 'mutationKey'
>;

export const useLoginUser = (oprions?: UseLoginUserOptions) =>
  useMutation({
    mutationKey: sessionApi.sessionKeys.mutation.login(),
    mutationFn: (user: LoginUserDto) => realworldApi.users.login({ user }),
    ...oprions,
  });
