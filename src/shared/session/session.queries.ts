import { queryOptions } from '@tanstack/react-query'
import { AuthService } from '~shared/api/auth'
import { queryClient } from '~shared/lib/react-query'
import { transformUserDtoToSession } from './session.lib'
import { Session } from './session.types'

export class SessionQueries {
  static currentSessionQuery() {
    return queryOptions({
      queryKey: ['session', 'current-user'],
      queryFn: async ({ signal }) => {
        const data = await AuthService.currentUserQuery(signal)
        return transformUserDtoToSession(data)
      },
      // @ts-expect-error
      initialData: () =>
        queryClient.getQueryData<Session>(['session', 'current-session']),
      initialDataUpdatedAt: () =>
        queryClient.getQueryState(['session', 'current-session'])
          ?.dataUpdatedAt,
    })
  }
}
