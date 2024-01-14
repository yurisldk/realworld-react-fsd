import { StateCreator, StoreApi } from 'zustand';
import { articleTypes } from '~entities/article';

export interface FilterByPageSlice {
  filter: Pick<articleTypes.ArticlesQueryDto, 'limit' | 'offset'>;
  toPage: (page: number) => void;
  reset: () => void;
}

const initialState = { filter: { limit: 10, offset: 0 } };

export type FilterByPageStore = StoreApi<FilterByPageSlice>;
export const createFilterByPageSlice: StateCreator<
  FilterByPageSlice,
  [],
  [],
  FilterByPageSlice
> = (set, get) => ({
  ...initialState,
  toPage: (page: number) => {
    const pageOffset = 1;
    const offset = (page - pageOffset) * get().filter.offset;
    set({ filter: { limit: 10, offset } });
  },
  reset: () => set(initialState),
});
