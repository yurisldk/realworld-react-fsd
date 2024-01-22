import { createStore } from 'zustand';
import { devtools } from 'zustand/middleware';
import { articleModel } from '~entities/article';
import { tabsModel } from '~shared/ui/tabs';

type Tab = 'articlesFeed' | 'articles' | 'tag';

const initialTabState: tabsModel.State<Tab> = {
  tab: 'articles',
};

export const tabStore = createStore<tabsModel.TabState<Tab>>()(
  devtools(tabsModel.createTabSlice<Tab>(initialTabState), {
    name: 'HomePage TabStore',
  }),
);

const initialArticleFilterState: articleModel.State = {
  pageQuery: { limit: 10, offset: 0 },
  filterQuery: {},
};

export const articleFilterStore = createStore<articleModel.FilterState>()(
  devtools(articleModel.createArticleFilterSlice(initialArticleFilterState), {
    name: 'HomePage ArticleFilterStore',
  }),
);

export const onArticlesFeed = () => {
  tabStore.getState().changeTab('articlesFeed');
  articleFilterStore.getState().changeFilter({ following: 'currentUser' });
};

export const onArticles = () => {
  tabStore.getState().changeTab('articles');
  articleFilterStore.getState().reset();
};

export const onTag = (tag: string) => {
  tabStore.getState().changeTab('tag');
  articleFilterStore.getState().changeFilter({ tag });
};
