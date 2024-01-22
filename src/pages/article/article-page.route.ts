import { createElement } from 'react';
import { RouteObject, redirect } from 'react-router-dom';
import { pathKeys } from '~shared/lib/react-router';
import { ArticlePage, ArticlePageParamsSchema } from './article-page.ui';

export const articlePageRoute: RouteObject = {
  path: 'article',
  children: [
    {
      index: true,
      loader: async () => {
        return redirect(pathKeys.page404());
      },
    },
    {
      path: ':slug',
      element: createElement(ArticlePage),
      loader: async ({ params }) => {
        const { success: isParamsValid } =
          ArticlePageParamsSchema.safeParse(params);

        if (!isParamsValid) {
          throw new Error('Invalid params');
        }

        return null;
      },
    },
  ],
};
