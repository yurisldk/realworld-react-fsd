import { queryOptions } from '@tanstack/react-query';
import { getAllTags } from '~shared/api/api.service';
import { queryClient } from '~shared/queryClient';
import { transformTagsDtoToTags } from './tag.lib';
import { Tags } from './tag.types';

export const tagsQueryOptions = queryOptions({
  queryKey: ['tags'],

  queryFn: async ({ signal }) => {
    const { data } = await getAllTags({ signal });
    const tags = transformTagsDtoToTags(data);
    return tags;
  },

  initialData: () => queryClient.getQueryData<Tags>(['tags']),

  initialDataUpdatedAt: () => queryClient.getQueryState(['tags'])?.dataUpdatedAt,
});
