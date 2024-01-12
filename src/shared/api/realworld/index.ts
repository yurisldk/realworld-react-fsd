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
  UnexpectedErrorModelDto,
  ErrorModelDto,
  HttpResponse,
  RequestParams,
} from './Api';

type GenericErrorModel = HttpResponse<unknown, ErrorModelDto>;

export function baseUrl(path: string) {
  return `https://api.realworld.io/api${path}`;
}

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

export { realworldApi };
export type {
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
  UnexpectedErrorModelDto,
  ErrorModelDto,
  HttpResponse,
  RequestParams,
  GenericErrorModel,
};
