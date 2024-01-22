import { createStore } from 'zustand';
import { DevtoolsOptions, devtools } from 'zustand/middleware';
import { articleModel, articleQueries } from '~entities/article';
import { tabsModel } from '~shared/ui/tabs';

type Tab = 'articlesFeed' | 'articles' | 'tag';

const initialTabState: tabsModel.State<Tab> = {
  tab: 'articles',
};
const tabStoreDevtoolsOptions: DevtoolsOptions = {
  name: 'HomePage TabStore',
};

export const tabStore = createStore<tabsModel.TabState<Tab>>()(
  devtools(
    tabsModel.createTabSlice<Tab>(initialTabState),
    tabStoreDevtoolsOptions,
  ),
);

const initialArticleFilterState: articleModel.State = {
  pageQuery: { limit: 10, offset: 0 },
  filterQuery: {},
};
const articleFilterStoreDevtoolsOptions: DevtoolsOptions = {
  name: 'HomePage ArticleFilterStore',
};

export const articleFilterStore = createStore<articleModel.FilterState>()(
  devtools(
    articleModel.createArticleFilterSlice(initialArticleFilterState),
    articleFilterStoreDevtoolsOptions,
  ),
);

export const onArticlesFeed = () => {
  articleQueries.infinityArticlesService.cancelQuery(
    articleFilterStore.getState().filterQuery,
  );
  tabStore.getState().changeTab('articlesFeed');
  articleFilterStore.getState().changeFilter({ following: 'currentUser' });
};

export const onArticles = () => {
  articleQueries.infinityArticlesService.cancelQuery(
    articleFilterStore.getState().filterQuery,
  );
  tabStore.getState().changeTab('articles');
  articleFilterStore.getState().reset();
};

export const onTag = (tag: string) => {
  articleQueries.infinityArticlesService.cancelQuery(
    articleFilterStore.getState().filterQuery,
  );
  tabStore.getState().changeTab('tag');
  articleFilterStore.getState().changeFilter({ tag });
};
