/* eslint-disable class-methods-use-this */
/* eslint-disable max-classes-per-file */
import { sessionService } from '../session';
import { ArticleService, IArticleService } from './article';
import { AuthService, IAuthService } from './auth';
import { AuthHeaderService } from './auth-header.service';
import { CommentService, ICommentService } from './comment';
import { FavoriteService, IFavoriteService } from './favorite';
import { IProfileService, ProfileService } from './profile';
import { ITagService, TagService } from './tag';
import { UrlService } from './url.service';

const BASE_URL = 'https://api.realworld.io/';

// TODO: remove exports
export const authHeaderService = new AuthHeaderService();
export const urlService = new UrlService(BASE_URL);

const tokenSetEventHandler =
  authHeaderService.tokenSetEventHandler.bind(authHeaderService);

const tokenResetEventHandler =
  authHeaderService.tokenResetEventHandler.bind(authHeaderService);

sessionService.onTokenSet(tokenSetEventHandler);
sessionService.onTokenReset(tokenResetEventHandler);

interface IApiServiceFactory {
  createAuthService(): IAuthService;
  createArticleService(): IArticleService;
  createProfileService(): IProfileService;
  createCommentService(): ICommentService;
  createTagService(): ITagService;
  createFavoriteService(): IFavoriteService;
}

class ApiServiceFactory implements IApiServiceFactory {
  createArticleService() {
    return new ArticleService(urlService, authHeaderService);
  }

  createAuthService() {
    return new AuthService(urlService, authHeaderService);
  }

  createCommentService() {
    return new CommentService(urlService, authHeaderService);
  }

  createFavoriteService() {
    return new FavoriteService(urlService, authHeaderService);
  }

  createProfileService() {
    return new ProfileService(urlService, authHeaderService);
  }

  createTagService() {
    return new TagService(urlService);
  }
}

class ApiService {
  article: IArticleService;

  auth: IAuthService;

  comment: ICommentService;

  favorite: IFavoriteService;

  profile: IProfileService;

  tag: ITagService;

  constructor(apiServiceFactory: ApiServiceFactory) {
    this.article = apiServiceFactory.createArticleService();
    this.auth = apiServiceFactory.createAuthService();
    this.comment = apiServiceFactory.createCommentService();
    this.favorite = apiServiceFactory.createFavoriteService();
    this.profile = apiServiceFactory.createProfileService();
    this.tag = apiServiceFactory.createTagService();
  }
}

const apiServiceFactory = new ApiServiceFactory();

export const apiService = new ApiService(apiServiceFactory);
