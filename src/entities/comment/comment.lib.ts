import type { CommentDto, CommentsDto } from '~shared/api/api.types';
import type { Comment, Comments } from './comment.types';

export function transformCommentDtoToComment(commentDto: CommentDto): Comment {
  const { comment } = commentDto;

  return {
    ...comment,
    author: {
      ...comment.author,
      bio: comment.author.bio || '',
    },
  };
}

export function transformCommentsDtoToComments(commentsDto: CommentsDto): Comments {
  return commentsDto.comments.map((comment) => transformCommentDtoToComment({ comment }));
}
