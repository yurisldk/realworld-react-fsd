import { ArticleDto } from '~shared/api/realworld';
import {
  MaybeArticleType,
  MaybeProfileType,
  MaybeUserType,
} from '../serverDatabase';
import { mapMswProfileDto } from './mapMswProfileDto';

export function mapMswArticleDto(
  maybeArticle: MaybeArticleType,
  maybeUser: MaybeUserType,
  maybeProfile: MaybeProfileType,
): ArticleDto {
  const { favoritedBy, authorId, ...article } = maybeArticle!;

  const author = mapMswProfileDto(maybeUser, maybeProfile);

  let favorited = false;

  if (maybeUser) {
    favorited = favoritedBy.includes(maybeUser.username);
  }

  return {
    ...article,
    favorited,
    favoritesCount: favoritedBy.length,
    author,
  };
}
