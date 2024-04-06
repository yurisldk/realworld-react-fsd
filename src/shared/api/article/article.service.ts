import { createJsonQuery, createJsonMutation } from '../../lib/fetch';
import { zodContract } from '../../lib/zod';
import { IAuthHeaderService } from '../auth-header.service';
import { IUrlService } from '../url.service';
import {
  ArticleDtoSchema,
  ArticlesDtoSchema,
  EmptySchema,
} from './article.contracts';
import {
  ArticlesQueryDto,
  ArticlesFeedQueryDto,
  CreateArticleDto,
  UpdateArticleDto,
  ArticlesDto,
  ArticleDto,
} from './article.types';

export interface IArticleService {
  articlesQuery(
    params: { query: ArticlesQueryDto },
    signal?: AbortSignal,
  ): Promise<ArticlesDto>;

  articlesFeedQuery(
    params: { query: ArticlesFeedQueryDto },
    signal?: AbortSignal,
  ): Promise<ArticlesDto>;

  articleQuery(
    params: { slug: string },
    signal?: AbortSignal,
  ): Promise<ArticleDto>;

  createArticleMutation(params: {
    createArticleDto: CreateArticleDto;
  }): Promise<ArticleDto>;

  deleteArticleMutation(params: { slug: string }): Promise<{}>;

  updateArticleMutation(params: {
    slug: string;
    updateArticleDto: UpdateArticleDto;
  }): Promise<ArticleDto>;
}

export class ArticleService implements IArticleService {
  constructor(
    private readonly urlService: IUrlService,
    private readonly authHeaderService: IAuthHeaderService,
  ) {}

  articlesQuery(params: { query: ArticlesQueryDto }, signal?: AbortSignal) {
    return createJsonQuery({
      request: {
        url: this.urlService.getUrl('/articles'),
        method: 'GET',
        headers: { ...this.authHeaderService.getHeader() },
        query: params.query,
      },
      response: { contract: zodContract(ArticlesDtoSchema) },
      abort: signal,
    });
  }

  articlesFeedQuery(
    params: { query: ArticlesFeedQueryDto },
    signal?: AbortSignal,
  ) {
    return createJsonQuery({
      request: {
        url: this.urlService.getUrl('/articles/feed'),
        method: 'GET',
        headers: { ...this.authHeaderService.getHeader() },
        query: params.query,
      },
      response: { contract: zodContract(ArticlesDtoSchema) },
      abort: signal,
    });
  }

  articleQuery(params: { slug: string }, signal?: AbortSignal) {
    return createJsonQuery({
      request: {
        url: this.urlService.getUrl(`/articles/${params.slug}`),
        method: 'GET',
        headers: { ...this.authHeaderService.getHeader() },
      },
      response: { contract: zodContract(ArticleDtoSchema) },
      abort: signal,
    });
  }

  createArticleMutation(params: { createArticleDto: CreateArticleDto }) {
    return createJsonMutation({
      request: {
        url: this.urlService.getUrl('/articles'),
        method: 'POST',
        headers: { ...this.authHeaderService.getHeader() },
        body: JSON.stringify({ article: params.createArticleDto }),
      },
      response: { contract: zodContract(ArticleDtoSchema) },
    });
  }

  deleteArticleMutation(params: { slug: string }) {
    return createJsonMutation({
      request: {
        url: this.urlService.getUrl(`/articles/${params.slug}`),
        method: 'DELETE',
        headers: { ...this.authHeaderService.getHeader() },
      },
      response: { contract: zodContract(EmptySchema) },
    });
  }

  updateArticleMutation(params: {
    slug: string;
    updateArticleDto: UpdateArticleDto;
  }) {
    return createJsonMutation({
      request: {
        url: this.urlService.getUrl(`/articles/${params.slug}`),
        method: 'PUT',
        headers: { ...this.authHeaderService.getHeader() },
        body: JSON.stringify({ article: params.updateArticleDto }),
      },
      response: { contract: zodContract(ArticleDtoSchema) },
    });
  }
}
