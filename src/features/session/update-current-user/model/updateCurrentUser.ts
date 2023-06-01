import { QueryClient, useMutation } from '@tanstack/react-query';
import { sessionApi } from '~entities/session';
import { conduitApi } from '~shared/api';

/**
 * @see https://tanstack.com/query/v4/docs/react/guides/optimistic-updates
 */
export const useUpdateCurrentUser = (queryClient: QueryClient) =>
  useMutation(
    async (user: sessionApi.User) =>
      conduitApi.Auth.updateCurrentUser({ user }),
    {
      onMutate: async (newUser) => {
        await queryClient.cancelQueries({ queryKey: ['currentUser'] });

        const prevUser = queryClient.getQueryData(['currentUser']);

        queryClient.setQueryData(['currentUser'], newUser);

        return { prevUser, newUser };
      },

      onError: (_, __, context) => {
        queryClient.setQueryData(['currentUser'], context?.prevUser);
      },

      onSettled: () => {
        queryClient.invalidateQueries({ queryKey: ['currentUser'] });
      },
    },
  );
