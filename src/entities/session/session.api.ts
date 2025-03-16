import { queryOptions } from '@tanstack/react-query';
import { getUser } from '~shared/api/api.service';
import { queryClient } from '~shared/queryClient';
import { transformUserDtoToUser } from './session.lib';
import { User } from './session.types';

export const sessionQueryOptions = queryOptions({
  queryKey: ['session', 'current-user'],

  queryFn: async ({ signal }) => {
    const { data } = await getUser({ signal });
    const user = transformUserDtoToUser(data);
    return user;
  },

  initialData: () => queryClient.getQueryData<User>(['session', 'current-user']),

  initialDataUpdatedAt: () => queryClient.getQueryState(['session', 'current-user'])?.dataUpdatedAt,
});
