import { RouteObject } from 'react-router-dom';

export const editorPageRoute: RouteObject = {
  path: 'editor',
  children: [
    {
      index: true,
      lazy: async () => {
        const [loader, Component] = await Promise.all([
          import('./editor-page.loader').then((module) => module.editorCreatePageLoader),
          import('./editor-page.ui').then((module) => module.CreateEditorPage),
        ]);
        return { loader, Component };
      },
    },
    {
      path: ':slug',
      lazy: async () => {
        const [loader, Component] = await Promise.all([
          import('./editor-page.loader').then((module) => module.editorUpdatePageLoader),
          import('./editor-page.ui').then((module) => module.UpdateEditorPage),
        ]);
        return { loader, Component };
      },
    },
  ],
};
