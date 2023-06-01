import { QueryClient } from '@tanstack/react-query';
import { sessionModel } from '~entities/session';

export function logout(queryClient: QueryClient) {
  sessionModel.deleteToken();
  queryClient.removeQueries(['currentUser']);
}
