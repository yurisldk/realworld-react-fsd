import { StateCreator, StoreApi } from 'zustand';
import { articleTypes } from '~entities/article';

export interface FilterByCategorySlice {
  filter: Pick<articleTypes.ArticlesQueryDto, 'author' | 'favorited' | 'tag'>;
  filterByAuthor: (author: string) => void;
  filterByFavorited: (favorited: string) => void;
  filterByTag: (tag: string) => void;
  reset: () => void;
}

const initialState = { filter: {} };

export type FilterByCategoryStore = StoreApi<FilterByCategorySlice>;
export const createFilterByCategorySlice: StateCreator<
  FilterByCategorySlice,
  [],
  [],
  FilterByCategorySlice
> = (set) => ({
  filter: {},
  filterByAuthor: (author: string) => set({ filter: { author } }),
  filterByFavorited: (favorited: string) => set({ filter: { favorited } }),
  filterByTag: (tag: string) => set({ filter: { tag } }),
  reset: () => set(initialState),
});
