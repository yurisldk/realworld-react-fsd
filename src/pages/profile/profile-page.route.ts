import { createElement } from 'react';
import { RouteObject, redirect } from 'react-router-dom';
import { articleQueries } from '~entities/article';
import { profileQueries } from '~entities/profile';
import { sessionQueries } from '~entities/session';
import { invalidDataError } from '~shared/lib/error-handler';
import { pathKeys, routerContracts } from '~shared/lib/react-router';
import { zodContract } from '~shared/lib/zod';
import {
  articleFilterStore,
  onAuthorArticles,
  onAuthorFavoritedArticles,
} from './profile-page.model';
import { ProfilePage } from './profile-page.ui';

export const profilePageRoute: RouteObject = {
  path: 'profile',
  children: [
    {
      index: true,
      loader: async () => redirect(pathKeys.page404()),
    },
    {
      path: ':username',
      element: createElement(ProfilePage),
      loader: async (args) => {
        const contract = zodContract(routerContracts.UsernamePageParamsSchema);

        if (!contract.isData(args.params)) {
          throw invalidDataError({
            validationErrors: contract.getErrorMessages(args.params),
          });
        }

        onAuthorArticles(args.params.username);

        await Promise.all([
          sessionQueries.prefetchCurrentUserQuery(),
          profileQueries.prefetchProfileQuery(args.params.username),
          articleQueries.prefetchArticlesInfinityQuery(articleFilterStore),
        ]);

        return args;
      },
    },
    {
      path: ':username/favorites',
      element: createElement(ProfilePage),
      loader: async (args) => {
        const contract = zodContract(routerContracts.UsernamePageParamsSchema);

        if (!contract.isData(args.params)) {
          throw invalidDataError({
            validationErrors: contract.getErrorMessages(args.params),
          });
        }

        onAuthorFavoritedArticles(args.params.username);

        await Promise.all([
          sessionQueries.prefetchCurrentUserQuery(),
          profileQueries.prefetchProfileQuery(args.params.username),
          articleQueries.prefetchArticlesInfinityQuery(articleFilterStore),
        ]);

        return args;
      },
    },
  ],
};
