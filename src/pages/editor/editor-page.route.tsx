import { createElement } from 'react';
import { RouteObject, redirect } from 'react-router-dom';
import { articleQueries } from '~entities/article';
import { sessionQueries } from '~entities/session';
import { invalidDataError } from '~shared/lib/error-handler';
import { zodContract } from '~shared/lib/json-query';
import { pathKeys, routerContracts } from '~shared/lib/react-router';
import { EditorPage } from './editor-page.ui';

export const editorPageRoute: RouteObject = {
  path: 'editor',
  children: [
    {
      index: true,
      element: createElement(EditorPage),
      loader: async (args) => {
        await sessionQueries.prefetchCurrentUserQuery();
        const user = sessionQueries.getCurrentUserQueryData();
        if (!user) return redirect(pathKeys.login());

        return args;
      },
    },
    {
      path: ':slug',
      element: createElement(EditorPage),
      loader: async (args) => {
        const contract = zodContract(routerContracts.SlugPageParamsSchema);

        if (!contract.isData(args.params)) {
          throw invalidDataError({
            validationErrors: contract.getErrorMessages(args.params),
          });
        }

        await Promise.all([
          sessionQueries.prefetchCurrentUserQuery(),
          articleQueries.articleService.prefetchQuery(args.params.slug),
        ]);

        const user = sessionQueries.getCurrentUserQueryData();
        if (!user) return redirect(pathKeys.login());

        return args;
      },
    },
  ],
};
