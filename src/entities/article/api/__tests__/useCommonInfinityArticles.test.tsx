import { renderHook, waitFor } from '@testing-library/react';
import { createWrapper } from '~shared/lib/react-query';
import { useCommonInfinityArticles } from '../articleApi';
import { setupGetMultipleArticlesHandlers } from '../msw/getMultipleArticlesHandlers';

// TODO: add params cases
describe('useCommonInfinityArticles', () => {
  beforeEach(() => setupGetMultipleArticlesHandlers());

  it('success', async () => {
    const { result } = renderHook(
      () => useCommonInfinityArticles({ limit: 1, offset: 0 }),
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
