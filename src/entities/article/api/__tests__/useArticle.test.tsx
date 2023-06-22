import { renderHook, waitFor } from '@testing-library/react';
import { realworldApi } from '~shared/api/realworld';
import { createWrapper } from '~shared/lib/react-query';
import { useArticle } from '../articleApi';
import { setupGetSingleArticleHandlers } from '../msw/getSingleArticleHandlers';

describe('useArticle', () => {
  beforeEach(() => {
    realworldApi.setSecurityData(null);
    setupGetSingleArticleHandlers();
  });

  it('should return data when article was found', async () => {
    const { result } = renderHook(
      () =>
        useArticle(
          'If-we-quantify-the-alarm-we-can-get-to-the-FTP-pixel-through-the-online-SSL-interface!-120863',
        ),
      { wrapper: createWrapper() },
    );
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toBeDefined();
  });

  it('should return data with `favorited: true` for favorited article', async () => {
    realworldApi.setSecurityData('jwt.token');

    const { result } = renderHook(
      () =>
        useArticle(
          'You-cant-connect-the-interface-without-programming-the-virtual-PNG-protocol!-120863',
          { secure: true },
        ),
      { wrapper: createWrapper() },
    );

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toBeDefined();
    expect(result.current.data?.favorited).toBe(true);
  });

  it('should return error when article wasn`t found', async () => {
    const { result } = renderHook(() => useArticle('invalid-slug'), {
      wrapper: createWrapper(),
    });
    await waitFor(() => expect(result.current.isError).toBe(true));
    expect(result.current.error).toBeDefined();
  });
});
