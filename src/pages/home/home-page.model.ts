import { createStore } from 'zustand';
import {
  FilterByCategorySlice,
  FilterByPageSlice,
  createFilterByCategorySlice,
  createFilterByPageSlice,
} from '~features/article';

type TabType = 'articlesFeed' | 'articles' | 'tag';

interface HomePageStore {
  activeTab: TabType;
  onArticlesFeedClicked: () => void;
  onArticlesClicked: () => void;
  onTagClicked: (tag: string) => void;
}

export const homePageStore = createStore<HomePageStore>()((set) => ({
  activeTab: 'articles',
  onArticlesFeedClicked: () => {
    filterByCategoryStore.getState().reset();
    filterByPageStore.getState().reset();
    set(() => ({ activeTab: 'articlesFeed' }));
  },
  onArticlesClicked: () => {
    filterByCategoryStore.getState().reset();
    filterByPageStore.getState().reset();
    set(() => ({ activeTab: 'articles' }));
  },
  onTagClicked: (tag: string) => {
    filterByCategoryStore.getState().filterByTag(tag);
    filterByPageStore.getState().reset();
    set(() => ({ activeTab: 'tag' }));
  },
}));

export const filterByCategoryStore = createStore<FilterByCategorySlice>()(
  (set, get, api) => ({
    ...createFilterByCategorySlice(set, get, api),
  }),
);

export const filterByPageStore = createStore<FilterByPageSlice>()(
  (set, get, api) => ({
    ...createFilterByPageSlice(set, get, api),
  }),
);

filterByCategoryStore.subscribe((state) => console.log(state.filter));
filterByPageStore.subscribe((state) => console.log(state.filter));
