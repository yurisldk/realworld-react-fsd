import { queryOptions } from '@tanstack/react-query';
import { queryClient } from '~shared/lib/react-query';
import { tagsQuery } from './tag.api';
import { Tags } from './tag.types';

export const tagKeys = {
  root: ['tag'] as const,
  tags() {
    return [...tagKeys.root, 'tags'] as const;
  },
};

export function getTagsQueryData() {
  return queryClient.getQueryData<Tags>(tagKeys.tags());
}
export function tagsQueryOptions() {
  const tagsKey = tagKeys.tags();
  return queryOptions({
    queryKey: tagsKey,
    queryFn: tagsQuery,
    initialData: () => getTagsQueryData()!,
    initialDataUpdatedAt: () =>
      queryClient.getQueryState(tagsKey)?.dataUpdatedAt,
  });
}
export function prefetchTagsQuery() {
  return queryClient.prefetchQuery(tagsQueryOptions());
}
