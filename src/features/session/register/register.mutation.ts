import { DefaultError, useMutation, UseMutationOptions } from '@tanstack/react-query';
import { registerUser } from '~shared/api/api.service';
import { queryClient } from '~shared/queryClient';
import { store } from '~shared/store';
import { sessionQueryOptions } from '~entities/session/session.api';
import { transformUserDtoToUser } from '~entities/session/session.lib';
import { setSession } from '~entities/session/session.model';
import { User } from '~entities/session/session.types';
import { transformRegisterUserToRegisterUserDto } from './register.lib';
import { RegisterUser } from './register.types';

export function useRegisterMutation(
  options: Pick<
    UseMutationOptions<User, DefaultError, RegisterUser, unknown>,
    'mutationKey' | 'onMutate' | 'onSuccess' | 'onError' | 'onSettled'
  > = {},
) {
  const { mutationKey = [], onMutate, onSuccess, onError, onSettled } = options;

  return useMutation({
    mutationKey: ['session', 'register-user', ...mutationKey],

    mutationFn: async (registerUserData: RegisterUser) => {
      const registerUserDto = transformRegisterUserToRegisterUserDto(registerUserData);
      const { data } = await registerUser(registerUserDto);
      const user = transformUserDtoToUser(data);
      return user;
    },

    onMutate,

    onSuccess: async (data, variables, context) => {
      queryClient.setQueryData(sessionQueryOptions.queryKey, data);
      store.dispatch(setSession(data));
      await onSuccess?.(data, variables, context);
    },

    onError,

    onSettled,
  });
}
