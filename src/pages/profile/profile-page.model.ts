import { createStore } from 'zustand';
import { devtools } from 'zustand/middleware';
import { articleModel } from '~entities/article';
import { tabsModel } from '~shared/ui/tabs';

type Tab = 'authorArticles' | 'authorFavoritedArticles';

const initialTabState: tabsModel.State<Tab> = {
  tab: 'authorArticles',
};

export const tabStore = createStore<tabsModel.TabState<Tab>>()(
  devtools(tabsModel.createTabSlice<Tab>(initialTabState), {
    name: 'ProfilePage TabStore',
  }),
);

const initialArticleFilterState: articleModel.State = {
  pageQuery: { limit: 10, offset: 0 },
  filterQuery: {},
};

export const articleFilterStore = createStore<articleModel.FilterState>()(
  devtools(articleModel.createArticleFilterSlice(initialArticleFilterState), {
    name: 'ProfilePage ArticleFilterStore',
  }),
);

export const onAuthorArticles = (username: string) => {
  tabStore.getState().changeTab('authorArticles');
  articleFilterStore.getState().changeFilter({ author: username });
};

export const onAuthorFavoritedArticles = (username: string) => {
  tabStore.getState().changeTab('authorFavoritedArticles');
  articleFilterStore.getState().changeFilter({ favorited: username });
};
