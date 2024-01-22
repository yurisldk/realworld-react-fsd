import {
  queryOptions as tsqQueryOptions,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { queryClient } from '~shared/lib/react-query';
import { pathKeys } from '~shared/lib/react-router';
import {
  createUserMutation,
  currentUserQuery,
  loginUserMutation,
  updateUserMutation,
} from './session.api';
import { hasToken, sessionStore } from './session.model';
import { User } from './session.types';

const keys = {
  root: () => ['session'],
  currentUser: () => [...keys.root(), 'currentUser'] as const,
  createUser: () => [...keys.root(), 'createUser'] as const,
  loginUser: () => [...keys.root(), 'loginUser'] as const,
  updateUser: () => [...keys.root(), 'updateUser'] as const,
  deleteUser: () => [...keys.root(), 'deleteUser'] as const,
};

export const userService = {
  queryKey: () => keys.currentUser(),

  getCache: () => queryClient.getQueryData<User>(userService.queryKey()),

  setCache: (user: User | null) =>
    queryClient.setQueryData(userService.queryKey(), user),

  removeCache: () =>
    queryClient.removeQueries({ queryKey: userService.queryKey() }),

  queryOptions: () => {
    const userKey = userService.queryKey();
    return tsqQueryOptions({
      queryKey: userKey,
      queryFn: async ({ signal }) =>
        hasToken() ? currentUserQuery(signal) : null,
      initialData: () => userService.getCache()!,
      initialDataUpdatedAt: () =>
        queryClient.getQueryState(userKey)?.dataUpdatedAt,
    });
  },

  prefetchQuery: async () => {
    queryClient.prefetchQuery(userService.queryOptions());
  },

  ensureQueryData: async () =>
    queryClient.ensureQueryData(userService.queryOptions()),
};

export function useCreateUserMutation() {
  const navigate = useNavigate();

  return useMutation({
    mutationKey: keys.createUser(),
    mutationFn: createUserMutation,
    onSuccess: async (user) => {
      sessionStore.setState({ token: user.token });
      userService.setCache(user);
      navigate(pathKeys.profile.byUsername({ username: user.username }));
    },
  });
}

export function useLoginUserMutation() {
  const navigate = useNavigate();

  return useMutation({
    mutationKey: keys.loginUser(),
    mutationFn: loginUserMutation,
    onSuccess: async (user) => {
      sessionStore.setState({ token: user.token });
      userService.setCache(user);
      navigate(pathKeys.profile.byUsername({ username: user.username }));
    },
  });
}

export function useUpdateUserMutation() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return useMutation({
    mutationKey: keys.updateUser(),
    mutationFn: updateUserMutation,
    onMutate: ({ user }) => {
      const prevUser = userService.getCache();

      const newUser = prevUser && {
        ...prevUser,
        user,
      };

      if (newUser) {
        userService.setCache(newUser);
      }

      return { prevUser };
    },
    onError: (_error, _variables, context) => {
      if (!context) return;
      if (context.prevUser) {
        userService.setCache(context.prevUser);
      }
    },
    onSuccess: (user) => {
      navigate(pathKeys.profile.byUsername({ username: user.username }));
    },
    onSettled: async () => {
      await queryClient.invalidateQueries({ queryKey: userService.queryKey() });
    },
  });
}

export function useLogoutMutation() {
  const navigate = useNavigate();

  return useMutation({
    mutationKey: keys.deleteUser(),
    onSettled: async () => {
      sessionStore.getState().updateToken(null);
      userService.setCache(null);
      await queryClient.invalidateQueries();
      navigate(pathKeys.home());
    },
  });
}
