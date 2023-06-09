import { renderHook, waitFor } from '@testing-library/react';
import { realworldApi } from '~shared/api/realworld';
import { createWrapper } from '~shared/lib/react-query';
import { useFeedInfinityArticles } from '../articleApi';
import { setupGetFeedArticlesHandlers } from '../msw/getFeedArticlesHandlers';

describe('useFeedInfinityArticles', () => {
  beforeEach(() => {
    setupGetFeedArticlesHandlers();
    realworldApi.setSecurityData(null);
  });

  it('success', async () => {
    realworldApi.setSecurityData('jwtToken');
    const { result } = renderHook(() => useFeedInfinityArticles({ limit: 1 }), {
      wrapper: createWrapper(),
    });
    await waitFor(() => expect(result.current.isFetching).toBe(false));
    expect(result.current.data?.pageParams).toStrictEqual([undefined]);

    result.current.fetchNextPage();
    await waitFor(() => expect(result.current.isFetching).toBe(false));
    expect(result.current.data?.pageParams).toStrictEqual([undefined, 1]);

    result.current.fetchNextPage();
    await waitFor(() => expect(result.current.isFetching).toBe(false));
    expect(result.current.data?.pageParams).toStrictEqual([undefined, 1, 2]);
  });

  it('error', async () => {
    const { result } = renderHook(() => useFeedInfinityArticles(), {
      wrapper: createWrapper(),
    });
    await waitFor(() => expect(result.current.isError).toBe(true));
    expect(result.current.error).toBeDefined();
  });
});
