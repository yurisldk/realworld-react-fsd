import { createElement } from 'react';
import { RouteObject } from 'react-router-dom';
import { EditorPage, EditorPageParamsSchema } from './editor-page.ui';

export const editorPageRoute: RouteObject = {
  path: 'editor',
  children: [
    {
      index: true,
      element: createElement(EditorPage),
      loader: async (args) => args,
    },
    {
      path: ':slug',
      element: createElement(EditorPage),
      loader: async (args) => {
        console.log(args);

        const parsed = EditorPageParamsSchema.safeParse(args.params);

        if (!parsed.success) {
          throw new Error('Invalid params');
        }

        return args;
      },
    },
  ],
};
