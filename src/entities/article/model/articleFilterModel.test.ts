import { act, renderHook } from '@testing-library/react';
import { StoreApi, createStore } from 'zustand';
import {
  ArticleFilter,
  ArticleFilterState,
  createArticleFilterSlice,
  selectFilter,
} from './articleFilterModel';

const initialFilterState: ArticleFilter = {
  offset: 0,
  limit: 10,
};

describe('articleFilterModel', () => {
  let store: StoreApi<ArticleFilterState>;

  beforeEach(() => {
    store = createStore<ArticleFilterState>()((...a) => ({
      ...createArticleFilterSlice(...a),
    }));
  });

  afterEach(() => {
    store.getState().resetFilter(initialFilterState);
  });

  it('should set the filter', () => {
    const newFilter: ArticleFilter = {
      tag: 'science',
      author: 'JohnDoe',
    };

    store.getState().setFilter(newFilter);

    expect(store.getState().filter).toEqual({
      offset: 0,
      limit: 10,
      tag: 'science',
      author: 'JohnDoe',
    });
  });

  it('should reset the filter', () => {
    const newFilter: ArticleFilter = {
      tag: 'technology',
      author: 'JaneDoe',
    };

    store.getState().setFilter(newFilter);
    store.getState().resetFilter(initialFilterState);

    expect(store.getState().filter).toEqual(initialFilterState);
  });

  it('should get correct filter state value', () => {
    const newFilter: ArticleFilter = {
      offset: 10,
      tag: 'technology',
      author: 'JaneDoe',
    };

    const { result } = renderHook(() => selectFilter(store));

    expect(result.current).toStrictEqual(initialFilterState);

    act(() => store.getState().setFilter(newFilter));
    expect(result.current).toStrictEqual({
      ...initialFilterState,
      ...newFilter,
    });

    act(() => store.getState().setFilter({ favorited: 'username' }));
    expect(result.current).toStrictEqual({
      ...initialFilterState,
      favorited: 'username',
    });

    act(() => store.getState().resetFilter(initialFilterState));
    expect(result.current).toStrictEqual(initialFilterState);
  });
});
