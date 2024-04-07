import { authHeaderService, urlService } from '~shared/api';
import { createJsonMutation, createJsonQuery } from '~shared/lib/fetch';
import { zodContract } from '~shared/lib/zod';
import {
  CommentResponseSchema,
  CommentsDtoSchema,
  EmptySchema,
} from './comment.contracts';
import { mapComment, mapComments } from './comment.lib';
import { CreateCommentDto } from './comment.types';

export async function commentsQuery(
  params: { slug: string },
  signal?: AbortSignal,
) {
  return createJsonQuery({
    request: {
      url: urlService.getUrl(`/articles/${params.slug}/comments`),
      method: 'GET',
      headers: { ...authHeaderService.getHeader() },
    },
    response: {
      contract: zodContract(CommentsDtoSchema),
      mapData: mapComments,
    },
    abort: signal,
  });
}

export async function createCommentMutation(params: {
  slug: string;
  comment: CreateCommentDto;
}) {
  return createJsonMutation({
    request: {
      url: urlService.getUrl(`/articles/${params.slug}/comments`),
      method: 'POST',
      headers: { ...authHeaderService.getHeader() },
      body: JSON.stringify({ comment: params.comment }),
    },
    response: {
      contract: zodContract(CommentResponseSchema),
      mapData: ({ comment }) => mapComment(comment),
    },
  });
}

export async function deleteCommentMutation(params: {
  slug: string;
  id: string;
}) {
  return createJsonMutation({
    request: {
      url: urlService.getUrl(`/articles/${params.slug}/comments/${params.id}`),
      method: 'DELETE',
      headers: { ...authHeaderService.getHeader() },
    },
    response: {
      contract: zodContract(EmptySchema),
      mapData: () => ({}),
    },
  });
}
