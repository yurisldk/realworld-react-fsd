import { queryOptions } from '@tanstack/react-query'
import { CommentService } from '~shared/api/comment'
import { queryClient } from '~shared/lib/react-query'
import { transformCommentsDtoToComments } from './comment.lib'
import { Comments } from './comment.types'

export class CommentQueries {
  static readonly keys = {
    root: ['comment'] as const,
  }

  static commentsQuery(slug: string) {
    return queryOptions({
      queryKey: [...this.keys.root, 'comments', slug],
      queryFn: async ({ signal }) => {
        const response = await CommentService.commentsQuery(slug, { signal })
        return transformCommentsDtoToComments(response.data)
      },
      // @ts-expect-error FIXME: https://github.com/TanStack/query/issues/7341
      initialData: () => queryClient.getQueryData<Comments>(['comment', slug]),
      initialDataUpdatedAt: () =>
        queryClient.getQueryState(['comment', slug])?.dataUpdatedAt,
    })
  }
}
