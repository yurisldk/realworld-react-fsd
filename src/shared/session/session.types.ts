import { z } from 'zod'
import { SessionSchema } from './session.contracts'

export type Session = z.infer<typeof SessionSchema>

interface ArticlePermission {
  create: boolean
  read: boolean
  update: boolean
  delete: boolean
  like: boolean
  dislike: boolean
}

interface ProfilePermission {
  follow: boolean
  unfollow: boolean
  update: boolean
}

interface CommentPermission {
  create: boolean
  read: boolean
  delete: boolean
}

interface PermissionGroup {
  article: ArticlePermission
  profile: ProfilePermission
  comment: CommentPermission
}

export type ArticleContext = { articleAuthorId: string }
export type CommentContext = { commentAuthorId: string }
export type ProfileContext = { profileOwnerId: string }

type PermissionContext = {
  article: ArticleContext
  profile: ProfileContext
  comment: CommentContext
}

export type Context = ArticleContext | CommentContext | ProfileContext

export type Action =
  | keyof ArticlePermission
  | keyof ProfilePermission
  | keyof CommentPermission

export interface SessionPermission {
  user: PermissionGroup
  guest: PermissionGroup
  author: PermissionGroup
  commenter: PermissionGroup
  owner: PermissionGroup
}

type ConditionalContext<T, F extends keyof PermissionGroup> = T extends 'delete'
  ? PermissionContext[F]
  : T extends 'update'
    ? PermissionContext[F]
    : never

type EnsurePermissionGroupKey<F, P = PermissionGroup> = F extends keyof P
  ? F
  : never

export type ConditionalPermissionContext<T, F> = ConditionalContext<
  T,
  EnsurePermissionGroupKey<F>
>
