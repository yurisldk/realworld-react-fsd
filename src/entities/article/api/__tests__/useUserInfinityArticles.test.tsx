import { renderHook, waitFor } from '@testing-library/react';
import { realworldApi } from '~shared/api/realworld';
import { createWrapper } from '~shared/lib/react-query';
import { useUserInfinityArticles } from '../articleApi';
import { setupGetUserArticlesHandlers } from '../msw/getUserArticlesHandlers';

describe('useUserInfinityArticles', () => {
  beforeEach(() => {
    setupGetUserArticlesHandlers();
    realworldApi.setSecurityData(null);
  });

  it('should handle pagination', async () => {
    realworldApi.setSecurityData('jwt.token');
    const { result } = renderHook(
      () => useUserInfinityArticles({ limit: 1, offset: 0 }),
      {
        wrapper: createWrapper(),
      },
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

  it('should return error if user wasn`t authorized', async () => {
    const { result } = renderHook(
      () => useUserInfinityArticles({ limit: 1, offset: 0 }),
      {
        wrapper: createWrapper(),
      },
    );
    await waitFor(() => expect(result.current.isError).toBe(true));
    expect(result.current.error).toBeDefined();
  });
});
