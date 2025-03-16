import { DefaultError, useMutation, UseMutationOptions } from '@tanstack/react-query';
import { logoutUser } from '~shared/api/api.service';
import { queryClient } from '~shared/queryClient';
import { store } from '~shared/store';
import { sessionQueryOptions } from '~entities/session/session.api';
import { resetSession } from '~entities/session/session.model';

export function useLogoutMutation(
  options: Pick<
    UseMutationOptions<void, DefaultError, void, unknown>,
    'mutationKey' | 'onMutate' | 'onSuccess' | 'onError' | 'onSettled'
  > = {},
) {
  const { mutationKey = [], onMutate, onSuccess, onError, onSettled } = options;

  return useMutation({
    mutationKey: ['session', 'logout-user', ...mutationKey],

    mutationFn: logoutUser,

    onMutate,

    onSuccess: async (data, variables, context) => {
      store.dispatch(resetSession());
      queryClient.removeQueries({ queryKey: sessionQueryOptions.queryKey });
      await onSuccess?.(data, variables, context);
    },

    onError,

    onSettled,
  });
}
