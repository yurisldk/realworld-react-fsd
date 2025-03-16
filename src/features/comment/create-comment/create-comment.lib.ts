import type { CreateCommentDto } from '~shared/api/api.types';
import type { CreateComment } from './create-comment.types';

export function transformCreateCommentToCreateCommentDto(createCommentDto: CreateComment): CreateCommentDto {
  return { comment: { body: createCommentDto.body } };
}
