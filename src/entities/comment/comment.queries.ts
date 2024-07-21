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
        const data = await CommentService.commentsQuery({ slug }, signal)
        return transformCommentsDtoToComments(data)
      },
      // @ts-expect-error FIXME:
      initialData: () => queryClient.getQueryData<Comments>(['comment', slug]),
      initialDataUpdatedAt: () =>
        queryClient.getQueryState(['comment', slug])?.dataUpdatedAt,
    })
  }
}
