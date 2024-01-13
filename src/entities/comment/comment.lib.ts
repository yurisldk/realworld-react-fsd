// eslint-disable-next-line no-restricted-imports
import { mapProfile } from '~entities/profile/@x/comment';
import { Comment, CommentDto, Comments, CommentsDto } from './comment.types';

export function mapComment(commentDto: CommentDto): Comment {
  return { ...commentDto, author: mapProfile(commentDto.author) };
}

export function mapComments(commentsDto: CommentsDto): Comments {
  return commentsDto.comments.map(mapComment);
}
