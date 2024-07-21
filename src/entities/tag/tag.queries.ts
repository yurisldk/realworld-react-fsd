import { queryOptions } from '@tanstack/react-query'
import { TagService } from '~shared/api/tag'
import { queryClient } from '~shared/lib/react-query'
import { transformTagsDtoToTags } from './tag.lib'
import { Tags } from './tag.types'

export const tagsQuery = () =>
  queryOptions({
    queryKey: ['tags'],
    queryFn: async ({ signal }) => {
      const data = await TagService.tagsQuery(signal)
      return transformTagsDtoToTags(data)
    },
    // @ts-expect-error FIXME:
    initialData: () => queryClient.getQueryData<Tags>(['tags']),
    initialDataUpdatedAt: () =>
      queryClient.getQueryState(['tags'])?.dataUpdatedAt,
  })
