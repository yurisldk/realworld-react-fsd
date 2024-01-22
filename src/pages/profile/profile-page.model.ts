import { createStore } from 'zustand';
import {
  FilterByCategorySlice,
  FilterByPageSlice,
  createFilterByCategorySlice,
  createFilterByPageSlice,
} from '~features/article';

type TabType = 'authorArticles' | 'favoritedArticles';

interface HomePageStore {
  activeTab: TabType;
  onAuthorArticlesClicked: (author: string) => void;
  onFavoritedArticlesClicked: (author: string) => void;
}

export const profilePageStore = createStore<HomePageStore>()((set) => ({
  activeTab: 'authorArticles',
  onAuthorArticlesClicked: (author: string) => {
    filterByCategoryStore.getState().filterByAuthor(author);
    filterByPageStore.getState().reset();
    set(() => ({ activeTab: 'authorArticles' }));
  },

  onFavoritedArticlesClicked: (author: string) => {
    filterByCategoryStore.getState().filterByFavorited(author);
    filterByPageStore.getState().reset();
    set(() => ({ activeTab: 'favoritedArticles' }));
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
