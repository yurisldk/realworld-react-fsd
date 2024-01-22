import { StateCreator, StoreApi } from 'zustand';
import { articleTypes } from '~entities/article';

type FilterByCategory = Pick<
  articleTypes.ArticlesQueryDto,
  'author' | 'favorited' | 'tag'
> & {
  following?: string;
};

type FilterByCategoryState = { filter: FilterByCategory };

export interface FilterByCategorySlice extends FilterByCategoryState {
  filterByAuthor: (author: string) => void;
  filterByFavorited: (favorited: string) => void;
  filterByFollowing: (following: string) => void;
  filterByTag: (tag: string) => void;
  reset: () => void;
}

const initialState: FilterByCategoryState = { filter: {} };

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
  filterByFollowing: (following: string) => set({ filter: { following } }),
  filterByTag: (tag: string) => set({ filter: { tag } }),
  reset: () => set(initialState),
});
