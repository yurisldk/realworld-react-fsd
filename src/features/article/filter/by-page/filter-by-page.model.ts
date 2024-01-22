import { StateCreator, StoreApi } from 'zustand';
import { articleTypes } from '~entities/article';

type FilterByPage = Pick<articleTypes.ArticlesQueryDto, 'limit' | 'offset'>;

type FilterByPageState = { filter: FilterByPage };

export interface FilterByPageSlice extends FilterByPageState {
  toPage: (page: number) => void;
  reset: () => void;
}

const initialState: FilterByPageState = { filter: { limit: 10, offset: 0 } };

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
