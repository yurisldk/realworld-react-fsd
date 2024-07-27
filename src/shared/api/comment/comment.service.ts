import { AxiosContracts } from '../../lib/axios'
import { realworld } from '../index'
import {
  CommentDtoSchema,
  CommentsDtoSchema,
  CreateCommentDtoSchema,
} from './comment.contracts'
import { CreateCommentDto } from './comment.types'

export class CommentService {
  static commentsQuery(slug: string, config: { signal?: AbortSignal }) {
    return realworld
      .get(`/articles/${slug}/comments`, config)
      .then(AxiosContracts.responseContract(CommentsDtoSchema))
  }

  static createCommentMutation(
    slug: string,
    data: { createCommentDto: CreateCommentDto },
  ) {
    const createCommentDto = AxiosContracts.requestContract(
      CreateCommentDtoSchema,
      data.createCommentDto,
    )
    return realworld
      .post(`/articles/${slug}/comments`, { comment: createCommentDto })
      .then(AxiosContracts.responseContract(CommentDtoSchema))
  }

  static deleteCommentMutation(slug: string, id: number) {
    return realworld.delete(`/articles/${slug}/comments/${id}`)
  }
}
