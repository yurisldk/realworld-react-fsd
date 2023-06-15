import { QueryClient, useMutation } from '@tanstack/react-query';
import { sessionApi } from '~entities/session';
import {
  GenericErrorModel,
  UserDto,
  realworldApi,
} from '~shared/api/realworld';

export const useUpdateCurrentUser = (queryClient: QueryClient) =>
  useMutation<
    UserDto,
    GenericErrorModel,
    UserDto,
    {
      queryKey: string[];
      prevUser: UserDto | undefined;
    }
  >(
    async (user: UserDto) => {
      const response = await realworldApi.user.updateCurrentUser({ user });

      return response.data.user;
    },
    {
      onMutate: async (newUser) => {
        const queryKey = sessionApi.sessionKeys.session.currentUser();

        await queryClient.cancelQueries({ queryKey });

        const prevUser = queryClient.getQueryData<UserDto>(queryKey);

        queryClient.setQueryData<UserDto>(queryKey, newUser);

        return { queryKey, prevUser };
      },

      onError: (_error, _variables, context) => {
        if (!context) return;
        queryClient.setQueryData(context.queryKey, context.prevUser);
      },

      onSettled: (_data, _error, _valiables, context) => {
        if (!context) return;
        queryClient.invalidateQueries({ queryKey: context.queryKey });
      },
    },
  );
