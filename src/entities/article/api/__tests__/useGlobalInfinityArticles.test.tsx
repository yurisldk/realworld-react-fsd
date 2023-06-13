import { renderHook, waitFor } from '@testing-library/react';
import { createWrapper } from '~shared/lib/react-query';
import { useGlobalInfinityArticles } from '../articleApi';
import { setupGetGlobalArticlesHandlers } from '../msw/getGlobalArticlesHandlers';

// TODO: add params cases
describe('useGlobalInfinityArticles', () => {
  beforeEach(() => setupGetGlobalArticlesHandlers());

  it('success', async () => {
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
});
