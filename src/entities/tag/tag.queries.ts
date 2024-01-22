import { queryOptions as tsqQueryOptions } from '@tanstack/react-query';
import { queryClient } from '~shared/lib/react-query';
import { tagsQuery } from './tag.api';
import { Tags } from './tag.types';

const keys = {
  root: () => ['tag'],
  tags: () => [...keys.root(), 'tags'] as const,
};

export const tagsService = {
  queryKey: () => keys.tags(),

  getCache: () => queryClient.getQueryData<Tags>(tagsService.queryKey()),

  setCache: (tags: Tags) =>
    queryClient.setQueryData(tagsService.queryKey(), tags),

  removeCache: () =>
    queryClient.removeQueries({ queryKey: tagsService.queryKey() }),

  queryOptions: () => {
    const tagsKey = tagsService.queryKey();
    return tsqQueryOptions({
      queryKey: tagsKey,
      queryFn: async ({ signal }) => tagsQuery(signal),
      initialData: () => tagsService.getCache()!,
      initialDataUpdatedAt: () =>
        queryClient.getQueryState(tagsKey)?.dataUpdatedAt,
    });
  },

  prefetchQuery: async () => {
    queryClient.prefetchQuery(tagsService.queryOptions());
  },

  ensureQueryData: async () =>
    queryClient.ensureQueryData(tagsService.queryOptions()),
};
