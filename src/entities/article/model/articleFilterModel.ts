import { StateCreator, StoreApi, useStore } from 'zustand';
// @ts-expect-error
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { devtools } from 'zustand/middleware';

export type ArticleFilter = {
  userfeed?: boolean;
  global?: boolean;
  tag?: string;
  author?: string;
  favorited?: string;
  offset?: number;
  limit?: number;
};

export type ArticleFilterState = {
  filter: ArticleFilter;
  setFilter: (filter: ArticleFilter) => void;
};

const initialFilterState: ArticleFilter = {
  offset: 0,
  limit: 10,
};

export const createArticleFilterSlice: StateCreator<
  ArticleFilterState,
  [['zustand/devtools', never]],
  [],
  ArticleFilterState
> = (set) => ({
  filter: initialFilterState,

  setFilter: (filter: ArticleFilter) =>
    set(
      () => ({
        filter: {
          ...initialFilterState,
          ...filter,
        },
      }),
      false,
      'articleFilter/setFilter',
    ),
});

export function selectFilter(model: StoreApi<ArticleFilterState>) {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  return useStore(model, (state) => state.filter);
}
