import { Api } from './Api';
import type {
  LoginUserDto,
  NewUserDto,
  UserDto,
  UpdateUserDto,
  ProfileDto,
  ArticleDto,
  NewArticleDto,
  UpdateArticleDto,
  CommentDto,
  NewCommentDto,
  GenericErrorModelDto,
  HttpResponse,
} from './Api';

const realworldApi = new Api({
  securityWorker: (token) =>
    token ? { headers: { Authorization: `Token ${token}` } } : {},
});

export {
  realworldApi,
  LoginUserDto,
  NewUserDto,
  UserDto,
  UpdateUserDto,
  ProfileDto,
  ArticleDto,
  NewArticleDto,
  UpdateArticleDto,
  CommentDto,
  NewCommentDto,
  GenericErrorModelDto,
  HttpResponse,
};
