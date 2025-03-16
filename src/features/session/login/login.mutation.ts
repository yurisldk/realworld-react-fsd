import { DefaultError, useMutation, UseMutationOptions } from '@tanstack/react-query';
import { loginUser } from '~shared/api/api.service';
import { queryClient } from '~shared/queryClient';
import { store } from '~shared/store';
import { sessionQueryOptions } from '~entities/session/session.api';
import { transformUserDtoToUser } from '~entities/session/session.lib';
import { setSession } from '~entities/session/session.model';
import type { User } from '~entities/session/session.types';
import { transformLoginUserToLoginUserDto } from './login.lib';
import type { LoginUser } from './login.types';

export function useLoginMutation(
  options: Pick<
    UseMutationOptions<User, DefaultError, LoginUser, unknown>,
    'mutationKey' | 'onMutate' | 'onSuccess' | 'onError' | 'onSettled'
  > = {},
) {
  const { mutationKey = [], onMutate, onSuccess, onError, onSettled } = options;

  return useMutation({
    mutationKey: ['session', 'login-user', ...mutationKey],

    mutationFn: async (loginUserData: LoginUser) => {
      const loginUserDto = transformLoginUserToLoginUserDto(loginUserData);
      const { data } = await loginUser(loginUserDto);
      const user = transformUserDtoToUser(data);
      return user;
    },

    onMutate,

    onSuccess: async (data, variables, context) => {
      store.dispatch(setSession(data));
      queryClient.setQueryData(sessionQueryOptions.queryKey, data);
      await onSuccess?.(data, variables, context);
    },

    onError,

    onSettled,
  });
}
