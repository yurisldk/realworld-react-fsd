import { createJsonMutation, createJsonQuery } from '../../lib/fetch';
import { zodContract } from '../../lib/zod';
import { IAuthHeaderService } from '../auth-header.service';
import { IUrlService } from '../url.service';
import {
  CommentDtoSchema,
  CommentsDtoSchema,
  EmptySchema,
} from './comment.contracts';
import { CommentDto, CommentsDto, CreateCommentDto } from './comment.types';

export interface ICommentService {
  commentsQuery(
    params: { slug: string },
    signal?: AbortSignal,
  ): Promise<CommentsDto>;

  createCommentMutation(params: {
    slug: string;
    comment: CreateCommentDto;
  }): Promise<CommentDto>;

  deleteCommentMutation(params: { slug: string; id: string }): Promise<{}>;
}

export class CommentService implements ICommentService {
  constructor(
    private readonly urlService: IUrlService,
    private readonly authHeaderService: IAuthHeaderService,
  ) {}

  commentsQuery(params: { slug: string }, signal?: AbortSignal) {
    return createJsonQuery({
      request: {
        url: this.urlService.getUrl(`/articles/${params.slug}/comments`),
        method: 'GET',
        headers: { ...this.authHeaderService.getHeader() },
      },
      response: { contract: zodContract(CommentsDtoSchema) },
      abort: signal,
    });
  }

  createCommentMutation(params: { slug: string; comment: CreateCommentDto }) {
    return createJsonMutation({
      request: {
        url: this.urlService.getUrl(`/articles/${params.slug}/comments`),
        method: 'POST',
        headers: { ...this.authHeaderService.getHeader() },
        body: JSON.stringify({ comment: params.comment }),
      },
      response: { contract: zodContract(CommentDtoSchema) },
    });
  }

  deleteCommentMutation(params: { slug: string; id: string }) {
    return createJsonMutation({
      request: {
        url: this.urlService.getUrl(
          `/articles/${params.slug}/comments/${params.id}`,
        ),
        method: 'DELETE',
        headers: { ...this.authHeaderService.getHeader() },
      },
      response: { contract: zodContract(EmptySchema) },
    });
  }
}
