import { createElement } from 'react';
import { RouteObject, redirect } from 'react-router-dom';
import { sessionModel } from '~entities/session';
import { PATH_PAGE } from '~shared/lib/react-router';
import { EditorPage, EditorPageParamsSchema } from './editor-page.ui';

export const editorPageRoute: RouteObject = {
  path: 'editor',
  children: [
    {
      index: true,
      element: createElement(EditorPage),
      loader: async () => {
        // sessionModel.sessionStore.get().token
        if (sessionModel.authorization.accessToken === '') {
          return redirect(PATH_PAGE.login);
        }

        return null;
      },
    },
    {
      path: ':slug',
      element: createElement(EditorPage),
      loader: async ({ params }) => {
        // sessionModel.sessionStore.get().token
        if (sessionModel.authorization.accessToken === '') {
          return redirect(PATH_PAGE.login);
        }

        const parsed = EditorPageParamsSchema.safeParse(params);

        if (!parsed.success) {
          throw new Error('Invalid params');
        }

        return null;
      },
    },
  ],
};
