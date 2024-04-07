import { createElement } from 'react';
import { RouteObject, redirect } from 'react-router-dom';
import { articleQueries } from '~entities/article';
import { sessionQueries } from '~entities/session';
import { invalidDataError } from '~shared/lib/fetch';
import { pathKeys, routerContracts } from '~shared/lib/react-router';
import { zodContract } from '~shared/lib/zod';
import { sessionService } from '~shared/session';
import { EditorPage } from './editor-page.ui';

export const editorPageRoute: RouteObject = {
  path: 'editor',
  children: [
    {
      index: true,
      element: createElement(EditorPage),
      loader: async (args) => {
        if (!sessionService.hasToken()) {
          return redirect(pathKeys.login());
        }

        sessionQueries.userService.prefetchQuery();
        return args;
      },
    },
    {
      path: ':slug',
      element: createElement(EditorPage),
      loader: async (args) => {
        if (!sessionService.hasToken()) {
          return redirect(pathKeys.login());
        }

        const contract = zodContract(routerContracts.SlugPageParamsSchema);

        if (!contract.isData(args.params)) {
          throw invalidDataError({
            validationErrors: contract.getErrorMessages(args.params),
            response: {},
          });
        }

        Promise.all([
          sessionQueries.userService.prefetchQuery(),
          articleQueries.articleService.prefetchQuery(args.params.slug),
        ]);

        return args;
      },
    },
  ],
};
