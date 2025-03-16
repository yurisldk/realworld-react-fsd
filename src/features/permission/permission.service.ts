import { useSelector } from 'react-redux';
import { store } from '~shared/store';
import { selectSession } from '~entities/session/session.model';
import { User } from '~entities/session/session.types';
import {
  SessionPermission,
  Action,
  ConditionalPermissionContext,
  Context,
  ArticleContext,
  CommentContext,
  ProfileContext,
} from './permission.types';

const sessionPermission: SessionPermission = {
  user: {
    article: {
      create: true,
      read: true,
      update: false,
      delete: false,
      like: true,
      dislike: true,
    },
    profile: { follow: true, unfollow: true, update: false },
    comment: { create: true, read: true, delete: false },
  },
  guest: {
    article: {
      create: false,
      read: true,
      update: false,
      delete: false,
      like: false,
      dislike: false,
    },
    profile: { follow: false, unfollow: false, update: false },
    comment: { create: false, read: false, delete: false },
  },
  author: {
    article: {
      create: true,
      read: true,
      update: true,
      delete: true,
      like: true,
      dislike: true,
    },
    profile: { follow: true, unfollow: true, update: false },
    comment: { create: true, read: true, delete: false },
  },
  commenter: {
    article: {
      create: false,
      read: true,
      update: false,
      delete: false,
      like: true,
      dislike: true,
    },
    profile: { follow: true, unfollow: true, update: false },
    comment: { create: true, read: true, delete: true },
  },
  owner: {
    article: {
      create: false,
      read: true,
      update: false,
      delete: false,
      like: true,
      dislike: true,
    },
    profile: { follow: true, unfollow: true, update: true },
    comment: { create: true, read: true, delete: false },
  },
};

type NestedKeysWithField<T, F extends keyof any> = {
  [K in keyof T]: T[K] extends { [key in F]: any } ? K : T[K] extends object ? NestedKeysWithField<T[K], F> : never;
}[keyof T];

export function useCanPerformAction<
  T extends Action,
  Resource extends NestedKeysWithField<SessionPermission, T>,
  ConditionalContext extends ConditionalPermissionContext<T, Resource>,
>(action: T, resource: Resource, context?: ConditionalContext): boolean {
  const session = useSelector(selectSession);
  const role = getRole({ context, session });

  // @ts-expect-error
  return !!sessionPermission[role][resource][action];
}

export function canPerformAction<
  T extends Action,
  Resource extends NestedKeysWithField<SessionPermission, T>,
  ConditionalContext extends ConditionalPermissionContext<T, Resource>,
>(action: T, resource: Resource, context?: ConditionalContext): boolean {
  const role = getRole({ context });

  // @ts-expect-error
  return !!sessionPermission[role][resource][action];
}

function getRole(config?: { context?: Context; session?: User | null }): keyof SessionPermission {
  const { context, session = store.getState().session } = config || {};

  if (!session) return 'guest';
  if (!context) return 'user';

  if (isArticleContext(context)) {
    if (context.articleAuthorId === session.username) return 'author';
  }

  if (isCommentContext(context)) {
    if (context.commentAuthorId === session.username) return 'commenter';
  }

  if (isProfileContext(context)) {
    if (context.profileOwnerId === session.username) return 'owner';
  }

  return 'user';
}

function isArticleContext(context: Context): context is ArticleContext {
  return (context as ArticleContext).articleAuthorId !== undefined;
}

function isCommentContext(context: Context): context is CommentContext {
  return (context as CommentContext).commentAuthorId !== undefined;
}

function isProfileContext(context: Context): context is ProfileContext {
  return (context as ProfileContext).profileOwnerId !== undefined;
}
