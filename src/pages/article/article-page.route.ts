import { createElement } from 'react';
import { RouteObject, redirect } from 'react-router-dom';
import { articleQueries } from '~entities/article';
import { commentQueries } from '~entities/comment';
import { sessionQueries } from '~entities/session';
import { invalidDataError } from '~shared/lib/error-handler';
import { pathKeys, routerContracts } from '~shared/lib/react-router';
import { zodContract } from '~shared/lib/zod';
import { ArticlePage } from './article-page.ui';

export const articlePageRoute: RouteObject = {
  path: 'article',
  children: [
    {
      index: true,
      loader: async () => redirect(pathKeys.page404()),
    },
    {
      path: ':slug',
      element: createElement(ArticlePage),
      loader: async (args) => {
        const contract = zodContract(routerContracts.SlugPageParamsSchema);

        if (!contract.isData(args.params)) {
          throw invalidDataError({
            validationErrors: contract.getErrorMessages(args.params),
          });
        }

        Promise.all([
          sessionQueries.prefetchCurrentUserQuery(),
          articleQueries.articleService.prefetchQuery(args.params.slug),
          commentQueries.prefetchCommentsQuery(args.params.slug),
        ]);

        return args;
      },
    },
  ],
};
