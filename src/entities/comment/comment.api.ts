import { sessionModel } from '~entities/session';
import { baseUrl } from '~shared/api/realworld';
import {
  createQuery,
  declareParams,
  zodContract,
} from '~shared/lib/json-query';
import {
  CommentResponseSchema,
  CommentsDtoSchema,
  EmptySchema,
} from './comment.contracts';
import { mapComment, mapComments } from './comment.lib';
import { CreateCommentDto } from './comment.types';

export const COMMENTS_KEY = ['comments', 'comments'];
export const commentsQuery = createQuery({
  params: declareParams<string>(),
  request: {
    url: (slug) => baseUrl(`/articles/${slug}/comments`),
    method: 'GET',
    headers: () => ({ ...sessionModel.authorizationHeader() }),
  },
  response: {
    contract: zodContract(CommentsDtoSchema),
    mapData: ({ result }) => mapComments(result),
  },
});

export const CREATE_COMMENT_KEY = ['comment', 'createComment'];
export const createCommentMutation = createQuery({
  params: declareParams<{ slug: string; comment: CreateCommentDto }>(),
  request: {
    url: ({ slug }) => baseUrl(`/articles/${slug}/comments`),
    method: 'POST',
    headers: () => ({ ...sessionModel.authorizationHeader() }),
    body: ({ comment }) => ({ comment }),
  },
  response: {
    contract: zodContract(CommentResponseSchema),
    mapData: ({ result }) => mapComment(result.comment),
  },
});

export const DELETE_COMMENT_KEY = ['comment', 'deleteComment'];
export const deleteCommentMutation = createQuery({
  params: declareParams<{ slug: string; id: string }>(),
  request: {
    url: ({ slug, id }) => baseUrl(`/articles/${slug}/comments/${id}`),
    method: 'DELETE',
    headers: () => ({ ...sessionModel.authorizationHeader() }),
  },
  response: {
    contract: zodContract(EmptySchema),
    mapData: () => ({}),
  },
});
