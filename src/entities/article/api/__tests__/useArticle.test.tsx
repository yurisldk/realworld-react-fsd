import { renderHook, waitFor } from '@testing-library/react';
import { createWrapper } from '~shared/lib/react-query';
import { useArticle } from '../articleApi';
import { setupGetSingleArticleHandlers } from '../msw/getSingleArticleHandlers';

describe('useArticle', () => {
  beforeEach(() => setupGetSingleArticleHandlers());

  it('success', async () => {
    const { result } = renderHook(
      () => useArticle('how-to-train-your-dragon'),
      { wrapper: createWrapper() },
    );
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toBeDefined();
  });

  it('error', async () => {
    const { result } = renderHook(() => useArticle('invalid-slug'), {
      wrapper: createWrapper(),
    });
    await waitFor(() => expect(result.current.isError).toBe(true));
    expect(result.current.error).toBeDefined();
  });
});
