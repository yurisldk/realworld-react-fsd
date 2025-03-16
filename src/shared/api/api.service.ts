import { AxiosRequestConfig } from 'axios';
import {
  ArticleDtoSchema,
  ArticlesDtoSchema,
  CommentDtoSchema,
  CommentsDtoSchema,
  CreateArticleDtoSchema,
  CreateCommentDtoSchema,
  LoginUserDtoSchema,
  ProfileDtoSchema,
  RegisterUserDtoSchema,
  TagsDtoSchema,
  UpdateArticleDtoSchema,
  UpdateUserDtoSchema,
  UserDtoSchema,
} from './api.contracts';
import { api } from './api.instance';
import { responseContract } from './api.lib';
import {
  CreateArticleDto,
  CreateCommentDto,
  LoginUserDto,
  RegisterUserDto,
  UpdateArticleDto,
  UpdateUserDto,
} from './api.types';

export function getArticleBySlug(slug: string, config?: AxiosRequestConfig) {
  return api.get(`/articles/${slug}`, config).then(responseContract(ArticleDtoSchema));
}

export function getAllArticles(config?: AxiosRequestConfig) {
  return api.get('/articles', config).then(responseContract(ArticlesDtoSchema));
}

export function getFeedArticles(config?: AxiosRequestConfig) {
  return api.get('/articles/feed', config).then(responseContract(ArticlesDtoSchema));
}

export function createArticle(createArticleDto: CreateArticleDto, config?: AxiosRequestConfig<CreateArticleDto>) {
  const data = CreateArticleDtoSchema.parse(createArticleDto);
  return api.post('/articles', data, config).then(responseContract(ArticleDtoSchema));
}

export function updateArticle(
  slug: string,
  updateArticleDto: UpdateArticleDto,
  config?: AxiosRequestConfig<UpdateArticleDto>,
) {
  const data = UpdateArticleDtoSchema.parse(updateArticleDto);
  return api.put(`/articles/${slug}`, data, config).then(responseContract(ArticleDtoSchema));
}

export function deleteArticle(slug: string, config?: AxiosRequestConfig) {
  return api.delete(`/articles/${slug}`, config);
}

export function favoriteArticle(slug: string, config?: AxiosRequestConfig) {
  return api.post(`/articles/${slug}/favorite`, {}, config).then(responseContract(ArticleDtoSchema));
}

export function unfavoriteArticle(slug: string, config?: AxiosRequestConfig) {
  return api.delete(`/articles/${slug}/favorite`, config).then(responseContract(ArticleDtoSchema));
}

export function getAllComments(slug: string, config?: AxiosRequestConfig) {
  return api.get(`/articles/${slug}/comments`, config).then(responseContract(CommentsDtoSchema));
}

export function createComment(slug: string, createCommentDto: CreateCommentDto, config?: AxiosRequestConfig) {
  const data = CreateCommentDtoSchema.parse(createCommentDto);
  return api.post(`/articles/${slug}/comments`, data, config).then(responseContract(CommentDtoSchema));
}

export function deleteComment(slug: string, id: number, config?: AxiosRequestConfig) {
  return api.delete(`/articles/${slug}/comments/${id}`, config);
}

export function getProfileByUsername(username: string, config?: AxiosRequestConfig) {
  return api.get(`/profiles/${username}`, config).then(responseContract(ProfileDtoSchema));
}

export function followProfile(username: string, config?: AxiosRequestConfig) {
  return api.post(`/profiles/${username}/follow`, {}, config).then(responseContract(ProfileDtoSchema));
}

export function unfollowProfile(username: string, config?: AxiosRequestConfig) {
  return api.delete(`/profiles/${username}/follow`, config).then(responseContract(ProfileDtoSchema));
}

export function getUser(config?: AxiosRequestConfig) {
  return api.get('/user', config).then(responseContract(UserDtoSchema));
}

export function loginUser(loginUserDto: LoginUserDto, config?: AxiosRequestConfig<LoginUserDto>) {
  const data = LoginUserDtoSchema.parse(loginUserDto);
  return api.post('/users/login', data, config).then(responseContract(UserDtoSchema));
}

export function registerUser(registerUserDto: RegisterUserDto, config?: AxiosRequestConfig<RegisterUserDto>) {
  const data = RegisterUserDtoSchema.parse(registerUserDto);
  return api.post('/users', data, config).then(responseContract(UserDtoSchema));
}

export function updateUser(updateUserDto: UpdateUserDto, config?: AxiosRequestConfig<UpdateUserDto>) {
  const data = UpdateUserDtoSchema.parse(updateUserDto);
  return api.put('/user', data, config).then(responseContract(UserDtoSchema));
}

export function logoutUser() {
  return Promise.resolve();
}

export function getAllTags(config?: AxiosRequestConfig) {
  return api.get('/tags', config).then(responseContract(TagsDtoSchema));
}
