import { Api, ContentType } from './Api';
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

const realworldApi = new Api<string>({
  baseApiParams: {
    headers: {
      'Content-Type': ContentType.Json,
    },
    format: 'json',
  },
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
