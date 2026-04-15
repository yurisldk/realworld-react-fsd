import type { RouteObject } from 'react-router';
import { requireAuthMiddleware } from '~shared/lib/react-router/requireAuthMiddleware';

export const editorRoute = {
  path: 'editor',
  middleware: [requireAuthMiddleware],
  children: [
    {
      index: true,
      lazy: async () => {
        const [{ EditorCreatePage: Component }, { articleCreateAction: action }] = await Promise.all([
          import('~pages/editor/editor.ui'),
          import('~pages/editor/actions/article-create.action'),
        ]);

        return { Component, action };
      },
    },
    {
      path: ':slug',
      lazy: async () => {
        const [{ EditorUpdatePage: Component }, { editorPageLoader: loader }, { articleUpdateAction: action }] =
          await Promise.all([
            import('~pages/editor/editor.ui'),
            import('~pages/editor/editor.loader'),
            import('~pages/editor/actions/article-update.action'),
          ]);

        return { Component, loader, action };
      },
    },
  ],
} satisfies RouteObject;
