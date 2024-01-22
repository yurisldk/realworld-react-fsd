import {
  queryOptions,
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
import { UpdateUserDto, User } from './session.types';

export const sessionKeys = {
  root: ['session'] as const,
  currentUser() {
    return [...sessionKeys.root, 'currentUser'] as const;
  },
  createUser() {
    return [...sessionKeys.root, 'createUser'] as const;
  },
  loginUser() {
    return [...sessionKeys.root, 'loginUser'] as const;
  },
  updateUser() {
    return [...sessionKeys.root, 'updateUser'] as const;
  },
};

export function getCurrentUserQueryData() {
  return queryClient.getQueryData<User>(sessionKeys.currentUser());
}
export function currentUserQueryOptions() {
  const currentUserKey = sessionKeys.currentUser();
  return queryOptions({
    queryKey: currentUserKey,
    queryFn: currentUserQuery,
    initialData: () => getCurrentUserQueryData()!,
    initialDataUpdatedAt: () =>
      queryClient.getQueryState(currentUserKey)?.dataUpdatedAt,
    enabled: hasToken(),
  });
}
export async function prefetchCurrentUserQuery() {
  if (!hasToken()) return;
  return queryClient.prefetchQuery(currentUserQueryOptions());
}

export function useCreateUserMutation() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return useMutation({
    mutationKey: sessionKeys.createUser(),
    mutationFn: createUserMutation,
    onSuccess: async (user) => {
      sessionStore.setState({ token: user.token });
      queryClient.setQueryData(sessionKeys.currentUser(), user);
      navigate(pathKeys.profile.byUsername({ username: user.username }));
    },
  });
}

export function useLoginUserMutation() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return useMutation({
    mutationKey: sessionKeys.loginUser(),
    mutationFn: loginUserMutation,
    onSuccess: async (user) => {
      sessionStore.setState({ token: user.token });
      queryClient.setQueryData(sessionKeys.currentUser(), user);
      navigate(pathKeys.profile.byUsername({ username: user.username }));
    },
  });
}

export function useUpdateUserMutation() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const currentUserKey = sessionKeys.currentUser();
  const user = queryClient.getQueryData<User>(currentUserKey);

  return useMutation({
    mutationKey: sessionKeys.updateUser(),
    mutationFn: updateUserMutation,
    onMutate: (updateUser) => {
      queryClient.setQueryData<UpdateUserDto>(currentUserKey, updateUser);
    },
    onError: () => {
      queryClient.setQueryData(currentUserKey, user);
    },
    onSuccess: (user) => {
      queryClient.setQueryData(sessionKeys.currentUser(), user);
      navigate(pathKeys.profile.byUsername({ username: user.username }));
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: currentUserKey });
    },
  });
}

export function useLogoutMutation() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return {
    mutate: () => {
      sessionStore.setState({ token: null });
      queryClient.removeQueries({ queryKey: sessionKeys.currentUser() });
      navigate(pathKeys.home());
    },
  };
}
