import { createElement } from 'react';
import { RouteObject } from 'react-router-dom';
import { articleQueries } from '~entities/article';
import { sessionQueries } from '~entities/session';
import { tagQueries } from '~entities/tag';
import { pathKeys } from '~shared/lib/react-router';
import { articleFilterStore, onArticlesFeed } from './home-page.model';
import { HomePage } from './home-page.ui';

export const homePageRoute: RouteObject = {
  path: pathKeys.home(),
  element: createElement(HomePage),
  loader: async (args) => {
    await sessionQueries.prefetchCurrentUserQuery();

    const user = sessionQueries.getCurrentUserQueryData();

    if (user) onArticlesFeed();

    await Promise.all([
      articleQueries.prefetchArticlesInfinityQuery(articleFilterStore),
      tagQueries.prefetchTagsQuery(),
    ]);

    return args;
  },
};
