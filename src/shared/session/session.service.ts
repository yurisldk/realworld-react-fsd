import { useSessionStore } from './session.model'
import {
  SessionPermission,
  Action,
  ConditionalPermissionContext,
  Context,
  ArticleContext,
  CommentContext,
  ProfileContext,
  Session,
} from './session.types'

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
}

type NestedKeysWithField<T, F extends keyof any> = {
  [K in keyof T]: T[K] extends { [key in F]: any }
    ? K
    : T[K] extends object
      ? NestedKeysWithField<T[K], F>
      : never
}[keyof T]

export class PermissionService {
  static useCanPerformAction<
    T extends Action,
    Resource extends NestedKeysWithField<SessionPermission, T>,
    ConditionalContext extends ConditionalPermissionContext<T, Resource>,
  >(action: T, resource: Resource, context?: ConditionalContext): boolean {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const session = useSessionStore.use.session()
    const role = PermissionService.getRole({ context, session })

    // @ts-expect-error
    return !!sessionPermission[role][resource][action]
  }

  static canPerformAction<
    T extends Action,
    Resource extends NestedKeysWithField<SessionPermission, T>,
    ConditionalContext extends ConditionalPermissionContext<T, Resource>,
  >(action: T, resource: Resource, context?: ConditionalContext): boolean {
    const role = this.getRole({ context })

    // @ts-expect-error
    return !!sessionPermission[role][resource][action]
  }

  private static getRole(config?: {
    context?: Context
    session?: Session | null
  }): keyof SessionPermission {
    const { context, session = useSessionStore.getState().session } =
      config || {}

    if (!session) return 'guest'
    if (!context) return 'user'

    if (this.isArticleContext(context)) {
      if (context.articleAuthorId === session.username) return 'author'
    }

    if (this.isCommentContext(context)) {
      if (context.commentAuthorId === session.username) return 'commenter'
    }

    if (this.isProfileContext(context)) {
      if (context.profileOwnerId === session.username) return 'owner'
    }

    return 'user'
  }

  private static isArticleContext(context: Context): context is ArticleContext {
    return (context as ArticleContext).articleAuthorId !== undefined
  }

  private static isCommentContext(context: Context): context is CommentContext {
    return (context as CommentContext).commentAuthorId !== undefined
  }

  private static isProfileContext(context: Context): context is ProfileContext {
    return (context as ProfileContext).profileOwnerId !== undefined
  }
}
