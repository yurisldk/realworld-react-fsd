import { sessionModel } from '~entities/session';
import { baseUrl } from '~shared/api/realworld';
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
      url: baseUrl(`/articles/${params.slug}/comments`),
      method: 'GET',
      headers: { ...sessionModel.authorizationHeader() },
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
      url: baseUrl(`/articles/${params.slug}/comments`),
      method: 'POST',
      headers: { ...sessionModel.authorizationHeader() },
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
      url: baseUrl(`/articles/${params.slug}/comments/${params.id}`),
      method: 'DELETE',
      headers: { ...sessionModel.authorizationHeader() },
    },
    response: {
      contract: zodContract(EmptySchema),
      mapData: () => ({}),
    },
  });
}
