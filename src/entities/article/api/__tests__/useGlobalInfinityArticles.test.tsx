import { renderHook, waitFor } from '@testing-library/react';
import { createWrapper } from '~shared/lib/react-query';
import { useGlobalInfinityArticles } from '../articleApi';
import { setupGetGlobalArticlesHandlers } from '../msw/getGlobalArticlesHandlers';

describe('useGlobalInfinityArticles', () => {
  beforeEach(() => setupGetGlobalArticlesHandlers());

  it('should handle pagination', async () => {
    const { result } = renderHook(
      () => useGlobalInfinityArticles({ limit: 1, offset: 0 }),
      { wrapper: createWrapper() },
    );

    await waitFor(() => expect(result.current.isFetching).toBe(false));
    expect(result.current.data?.pageParams).toStrictEqual([undefined]);

    result.current.fetchNextPage();
    await waitFor(() => expect(result.current.isFetching).toBe(false));
    expect(result.current.data?.pageParams).toStrictEqual([undefined, 1]);

    result.current.fetchNextPage();
    await waitFor(() => expect(result.current.isFetching).toBe(false));
    expect(result.current.data?.pageParams).toStrictEqual([undefined, 1, 2]);
  });

  it('should return data when author query was provided', async () => {
    const { result } = renderHook(
      () => useGlobalInfinityArticles({ limit: 10, offset: 0, author: 'Jake' }),
      { wrapper: createWrapper() },
    );

    await waitFor(() => expect(result.current.isFetching).toBe(false));
    expect(result.current.data?.pages.length).toBe(1);
    expect(result.current.data?.pages[0].length).toBe(7);
  });

  it('should return data when tag query was provided', async () => {
    const { result } = renderHook(
      () =>
        useGlobalInfinityArticles({
          limit: 10,
          offset: 0,
          tag: 'ipsum',
        }),
      { wrapper: createWrapper() },
    );

    await waitFor(() => expect(result.current.isFetching).toBe(false));
    expect(result.current.data?.pages.length).toBe(1);
    expect(result.current.data?.pages[0].length).toBe(10);

    result.current.fetchNextPage();
    await waitFor(() => expect(result.current.isFetching).toBe(false));
    expect(result.current.data?.pages.length).toBe(2);
    expect(result.current.data?.pages[1].length).toBe(3);
  });

  it('should return data when favorited query was provided', async () => {
    const { result } = renderHook(
      () =>
        useGlobalInfinityArticles({ limit: 10, offset: 0, favorited: 'Jake' }),
      { wrapper: createWrapper() },
    );

    await waitFor(() => expect(result.current.isFetching).toBe(false));
    expect(result.current.data?.pages.length).toBe(1);
    expect(result.current.data?.pages[0].length).toBe(2);
  });
});
