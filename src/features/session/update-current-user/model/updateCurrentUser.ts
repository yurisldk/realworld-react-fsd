import { QueryClient, useMutation } from '@tanstack/react-query';
import { sessionApi } from '~entities/session';
import {
  GenericErrorModel,
  UserDto,
  realworldApi,
} from '~shared/api/realworld';

export const useUpdateCurrentUser = (
  queryKey: unknown[],
  queryClient: QueryClient,
) =>
  useMutation<
    UserDto,
    GenericErrorModel,
    sessionApi.User,
    {
      prevUser: unknown;
      newUser: sessionApi.User;
    }
  >(
    async (user: sessionApi.User) => {
      const response = await realworldApi.user.updateCurrentUser({ user });

      return response.data.user;
    },
    {
      onMutate: async (newUser) => {
        await queryClient.cancelQueries({ queryKey });

        const prevUser = queryClient.getQueryData(queryKey);

        queryClient.setQueryData(queryKey, newUser);

        return { prevUser, newUser };
      },

      onError: (_, __, context) => {
        queryClient.setQueryData(queryKey, context?.prevUser);
      },

      onSettled: () => {
        queryClient.invalidateQueries({ queryKey });
      },
    },
  );
