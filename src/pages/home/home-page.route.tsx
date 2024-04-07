import { createElement } from 'react';
import { RouteObject } from 'react-router-dom';
import { articleQueries } from '~entities/article';
import { sessionQueries } from '~entities/session';
import { tagQueries } from '~entities/tag';
import { pathKeys } from '~shared/lib/react-router';
import { sessionService } from '~shared/session';
import {
  articleFilterStore,
  onArticles,
  onArticlesFeed,
} from './home-page.model';
import { HomePage } from './home-page.ui';

export const homePageRoute: RouteObject = {
  path: pathKeys.home(),
  element: createElement(HomePage),
  loader: async (args) => {
    if (sessionService.hasToken()) {
      onArticlesFeed();
    } else {
      onArticles();
    }

    Promise.all([
      sessionQueries.userService.prefetchQuery(),
      articleQueries.infinityArticlesService.prefetchQuery(articleFilterStore),
      tagQueries.tagsService.prefetchQuery(),
    ]);

    return args;
  },
};
