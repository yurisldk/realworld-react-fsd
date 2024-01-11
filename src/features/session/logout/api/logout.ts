import { QueryClient } from '@tanstack/react-query';
import { sessionApi, sessionModel } from '~entities/session';

export function logout(queryClient: QueryClient) {
  sessionModel.deleteToken();
  queryClient.removeQueries({
    queryKey: sessionApi.sessionKeys.session.currentUser(),
  });
}
