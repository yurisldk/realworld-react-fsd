import { renderHook, waitFor } from '@testing-library/react';
import { createWrapper } from '~shared/lib/react-query';
import { useCommentsQuery } from './commentApi';
import { setupGetArticlesCommentsHandlers } from './msw/getArticlesCommentsHandlers';

describe('useCommentsQuery', () => {
  beforeEach(() => setupGetArticlesCommentsHandlers());

  it('should return data', async () => {
    const { result } = renderHook(
      () =>
        useCommentsQuery(
          'If-we-quantify-the-alarm-we-can-get-to-the-FTP-pixel-through-the-online-SSL-interface!-120863',
        ),
      {
        wrapper: createWrapper(),
      },
    );
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toBeDefined();
  });
});
