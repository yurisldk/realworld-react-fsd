import { DefaultError, useMutation, UseMutationOptions } from '@tanstack/react-query';
import { updateUser } from '~shared/api/api.service';
import { queryClient } from '~shared/queryClient';
import { store } from '~shared/store';
import { profileQueryOptions } from '~entities/profile/profile.api';
import { sessionQueryOptions } from '~entities/session/session.api';
import { transformUserDtoToUser } from '~entities/session/session.lib';
import { setSession } from '~entities/session/session.model';
import { User } from '~entities/session/session.types';
import { transformUpdateUserToUpdateUserDto } from './update.lib';
import { UpdateUser } from './update.types';

export function useUpdateSessionMutation(
  options: Pick<
    UseMutationOptions<User, DefaultError, UpdateUser, unknown>,
    'mutationKey' | 'onMutate' | 'onSuccess' | 'onError' | 'onSettled'
  > = {},
) {
  const { mutationKey = [], onMutate, onSuccess, onError, onSettled } = options;

  return useMutation({
    mutationKey: ['session', 'update-session', ...mutationKey],

    mutationFn: async (updateUserData: UpdateUser) => {
      const updateUserDto = transformUpdateUserToUpdateUserDto(updateUserData);
      const { data } = await updateUser(updateUserDto);
      const user = transformUserDtoToUser(data);
      return user;
    },

    onMutate,

    onSuccess: async (data, variables, context) => {
      const sessionQueryKey = sessionQueryOptions.queryKey;
      const profileQueryKey = profileQueryOptions(data.username).queryKey;

      queryClient.setQueryData(sessionQueryKey, data);
      queryClient.setQueryData(profileQueryKey, { ...data, following: false });
      store.dispatch(setSession(data));

      await Promise.all([
        queryClient.invalidateQueries({ queryKey: sessionQueryKey }),
        queryClient.invalidateQueries({ queryKey: profileQueryKey }),
        onSuccess?.(data, variables, context),
      ]);
    },

    onError,

    onSettled,
  });
}
