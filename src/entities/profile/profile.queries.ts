import { queryOptions } from '@tanstack/react-query'
import { ProfileService } from '~shared/api/profile'
import { queryClient } from '~shared/lib/react-query'
import { Profile } from './profie.types'
import { transformProfileDtoToProfile } from './profile.lib'

export class ProfileQueries {
  static readonly keys = {
    root: ['profile'] as const,
  }

  static profileQuery(username: string) {
    return queryOptions({
      queryKey: [...this.keys.root, username],
      queryFn: async ({ signal }) => {
        const response = await ProfileService.profileQuery(username, { signal })
        return transformProfileDtoToProfile(response.data)
      },
      // @ts-expect-error FIXME: https://github.com/TanStack/query/issues/7341
      initialData: () =>
        queryClient.getQueryData<Profile>([...this.keys.root, username]),
      initialDataUpdatedAt: () =>
        queryClient.getQueryState([...this.keys.root, username])?.dataUpdatedAt,
    })
  }
}
