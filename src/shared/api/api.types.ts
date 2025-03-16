import { z } from 'zod';
import {
  ArticleDtoSchema,
  ArticlesDtoSchema,
  FilterQueryDtoSchema,
  CreateArticleDtoSchema,
  UpdateArticleDtoSchema,
  CommentDtoSchema,
  CommentsDtoSchema,
  CreateCommentDtoSchema,
  ProfileDtoSchema,
  UserDtoSchema,
  LoginUserDtoSchema,
  RegisterUserDtoSchema,
  UpdateUserDtoSchema,
  ApiErrorDataDtoSchema,
  ApiErrorDataSchema,
  TagsDtoSchema,
} from './api.contracts';

export type ArticleDto = z.infer<typeof ArticleDtoSchema>;
export type ArticlesDto = z.infer<typeof ArticlesDtoSchema>;
export type FilterQueryDto = z.infer<typeof FilterQueryDtoSchema>;
export type CreateArticleDto = z.infer<typeof CreateArticleDtoSchema>;
export type UpdateArticleDto = z.infer<typeof UpdateArticleDtoSchema>;

export type CommentDto = z.infer<typeof CommentDtoSchema>;
export type CommentsDto = z.infer<typeof CommentsDtoSchema>;
export type CreateCommentDto = z.infer<typeof CreateCommentDtoSchema>;

export type ProfileDto = z.infer<typeof ProfileDtoSchema>;

export type UserDto = z.infer<typeof UserDtoSchema>;
export type LoginUserDto = z.infer<typeof LoginUserDtoSchema>;
export type RegisterUserDto = z.infer<typeof RegisterUserDtoSchema>;
export type UpdateUserDto = z.infer<typeof UpdateUserDtoSchema>;

export type TagsDto = z.infer<typeof TagsDtoSchema>;

export type ApiErrorDataDto = z.infer<typeof ApiErrorDataDtoSchema>;
export type ApiErrorData = z.infer<typeof ApiErrorDataSchema>;
