import { handleMutationIssue } from '~shared/lib/error'
import { createJsonMutation, createJsonQuery } from '../../lib/fetch'
import { authHeaderService, getUrl } from '../api.service'
import {
  CommentDtoSchema,
  CommentsDtoSchema,
  EmptySchema,
} from './comment.contracts'
import { CreateCommentDto } from './comment.types'

export class CommentService {
  static commentsQuery(params: { slug: string }, signal?: AbortSignal) {
    return createJsonQuery({
      request: {
        url: getUrl(`/articles/${params.slug}/comments`),
        method: 'GET',
        headers: authHeaderService.getHeader(),
      },
      response: { contract: CommentsDtoSchema },
      abort: signal,
    })
  }

  static createCommentMutation(params: {
    slug: string
    comment: CreateCommentDto
  }) {
    return createJsonMutation({
      request: {
        url: getUrl(`/articles/${params.slug}/comments`),
        method: 'POST',
        headers: authHeaderService.getHeader(),
        body: JSON.stringify({ comment: params.comment }),
      },
      response: { contract: CommentDtoSchema },
    }).catch((e) => {
      throw handleMutationIssue(e)
    })
  }

  static deleteCommentMutation(params: { slug: string; id: number }) {
    return createJsonMutation({
      request: {
        url: getUrl(`/articles/${params.slug}/comments/${params.id}`),
        method: 'DELETE',
        headers: authHeaderService.getHeader(),
      },
      // FIXME:
      response: { contract: EmptySchema },
    }).catch((e) => {
      throw handleMutationIssue(e)
    })
  }
}
