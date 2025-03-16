import { queryOptions } from '@tanstack/react-query';
import { getAllComments } from '~shared/api/api.service';
import { queryClient } from '~shared/queryClient';
import { transformCommentsDtoToComments } from './comment.lib';
import { Comments } from './comment.types';

export const commentsQueryOptions = (slug: string) =>
  queryOptions({
    queryKey: ['comments', slug],

    queryFn: async ({ signal }) => {
      const { data } = await getAllComments(slug, { signal });
      const comments = transformCommentsDtoToComments(data);
      return comments;
    },

    initialData: () => queryClient.getQueryData<Comments>(['comments', slug]),

    initialDataUpdatedAt: () => queryClient.getQueryState(['comments', slug])?.dataUpdatedAt,
  });
