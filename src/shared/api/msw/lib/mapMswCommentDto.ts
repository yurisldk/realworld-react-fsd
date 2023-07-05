import { CommentDto } from '~shared/api/realworld';
import {
  MaybeCommentType,
  MaybeProfileType,
  MaybeUserType,
} from '../serverDatabase';
import { mapMswProfileDto } from './mapMswProfileDto';

export function mapMswCommentDto(
  maybeComment: MaybeCommentType,
  maybeUser: MaybeUserType,
  maybeProfile: MaybeProfileType,
): CommentDto {
  const { articleId, authorId, id, ...comment } = maybeComment!;

  const author = mapMswProfileDto(maybeUser, maybeProfile);

  return {
    ...comment,
    id: Number(id),
    author,
  };
}
