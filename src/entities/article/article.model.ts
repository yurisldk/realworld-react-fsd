import { StateCreator } from 'zustand';
import type { FilterQuery, PageQueryDto } from './article.types';

export type State = {
  pageQuery: PageQueryDto;
  filterQuery: FilterQuery;
};

export type Actions = {
  changeFilter: (filterQuery: FilterQuery) => void;
  reset: () => void;
};

export type FilterState = State & Actions;
export const createArticleFilterSlice =
  (
    initialState: State,
  ): StateCreator<
    FilterState,
    [['zustand/devtools', never]],
    [],
    FilterState
  > =>
  (set) => ({
    ...initialState,
    changeFilter: (filterQuery: FilterQuery) =>
      set({ filterQuery }, false, 'changeFilter'),
    reset: () => set(initialState, false, 'reset'),
  });
