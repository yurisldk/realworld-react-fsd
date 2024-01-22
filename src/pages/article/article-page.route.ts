import { createElement } from 'react';
import { RouteObject, redirect } from 'react-router-dom';
import { PATH_PAGE } from '~shared/lib/react-router';
import { ArticlePage, ArticlePageParamsSchema } from './article-page.ui';

export const articlePageRoute: RouteObject = {
  path: 'article',
  children: [
    {
      index: true,
      loader: async () => {
        return redirect(PATH_PAGE.page404);
      },
    },
    {
      path: ':slug',
      element: createElement(ArticlePage),
      loader: async ({ params }) => {
        const parsed = ArticlePageParamsSchema.safeParse(params);

        if (!parsed.success) {
          throw new Error('Invalid params');
        }

        return null;
      },
    },
  ],
};
