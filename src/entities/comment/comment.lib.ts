import { commentTypesDto } from '~shared/api/comment'
import { Comment, Comments } from './comment.types'

export function transformCommentDtoToComment(
  commentDto: commentTypesDto.CommentDto,
): Comment {
  const { comment } = commentDto

  return {
    ...comment,
    author: {
      ...comment.author,
      bio: comment.author.bio || '',
    },
  }
}

export function transformCommentsDtoToComments(
  commentsDto: commentTypesDto.CommentsDto,
): Comments {
  const { comments } = commentsDto
  return new Map(
    comments.map((comment) => [
      comment.id,
      transformCommentDtoToComment({ comment }),
    ]),
  )
}
