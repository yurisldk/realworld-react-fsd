import type { MiddlewareFunction } from 'react-router';
import { clearToken, getToken, setToken } from '~shared/api/auth-storage';
import {
  getGetCurrentUserQueryOptions,
  getGetCurrentUserQueryKey,
} from '~shared/api/generated/fetch/user-and-authentication/user-and-authentication';
import { isApiTransportError } from '~shared/api/handleApiError';
import { queryClient } from '~shared/api/queryClient';
import { userContext } from './userContext';

export const loadUserMiddleware: MiddlewareFunction = async ({ request, context }, next) => {
  const token = getToken();

  if (!token) {
    queryClient.setQueryData(getGetCurrentUserQueryKey(), null);
    context.set(userContext, null);
    return next();
  }

  try {
    const data = await queryClient
      .ensureQueryData(
        getGetCurrentUserQueryOptions({
          query: {
            staleTime: 60 * 1000,
            gcTime: 10 * 60 * 1000,
          },
          request: { signal: request.signal },
        }),
      )
      .then((response) => response.data);

    setToken(data.user.token);
    context.set(userContext, data);
  } catch (error) {
    if (isApiTransportError(error) && error.status === 401) {
      clearToken();
      queryClient.setQueryData(getGetCurrentUserQueryKey(), null);
      context.set(userContext, null);
      return next();
    }

    throw error;
  }

  return next();
};
