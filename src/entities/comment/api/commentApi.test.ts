import { renderHook, waitFor } from '@testing-library/react';
import { createWrapper } from '~shared/lib/react-query';
import { useCommentsQuery } from './commentApi';
import { setupGetArticlesCommentsHandlers } from './msw/getArticlesCommentsHandlers';

describe('useArticle', () => {
  beforeEach(() => setupGetArticlesCommentsHandlers());

  it('success', async () => {
    const { result } = renderHook(
      () => useCommentsQuery('how-to-train-your-dragon'),
      {
        wrapper: createWrapper(),
      },
    );
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toBeDefined();
  });

  it('error', async () => {
    const { result } = renderHook(() => useCommentsQuery('invalid-slug'), {
      wrapper: createWrapper(),
    });
    await waitFor(() => expect(result.current.isError).toBe(true));
    expect(result.current.error).toBeDefined();
  });
});
