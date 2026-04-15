import type { RouteObject } from 'react-router';
import { requireAuthMiddleware } from '~shared/lib/react-router/requireAuthMiddleware';
import { articlePaths } from './article.paths';

export const articleRoute = {
  path: 'article/:slug',
  lazy: async () => {
    const [{ ArticlePage: Component }, { articlePageLoader: loader }] = await Promise.all([
      import('~pages/article/article.ui'),
      import('~pages/article/article.loader'),
    ]);

    return { Component, loader };
  },
  children: [
    {
      path: articlePaths.delete,
      middleware: [requireAuthMiddleware],
      lazy: async () => {
        const { articleDeleteAction: action } = await import('~pages/article/actions/article-delete.action');
        return { action };
      },
    },
    {
      path: articlePaths.followToggle,
      middleware: [requireAuthMiddleware],
      lazy: async () => {
        const { profileFollowToggleAction: action } = await import(
          '~pages/article/actions/profile-follow-toggle.action'
        );
        return { action };
      },
    },
    {
      path: articlePaths.favoriteToggle,
      middleware: [requireAuthMiddleware],
      lazy: async () => {
        const { articleFavoriteToggleAction: action } = await import(
          '~pages/article/actions/article-favorite-toggle.action'
        );
        return { action };
      },
    },
    {
      path: articlePaths.comments,
      middleware: [requireAuthMiddleware],
      lazy: async () => {
        const { commentCreateAction: action } = await import('~pages/article/actions/comment-create.action');
        return { action };
      },
    },
    {
      path: articlePaths.comment,
      middleware: [requireAuthMiddleware],
      lazy: async () => {
        const { commentDeleteAction: action } = await import('~pages/article/actions/comment-delete.action');
        return { action };
      },
    },
  ],
} satisfies RouteObject;
