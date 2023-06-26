import { renderHook } from '@testing-library/react';
import { vi } from 'vitest';
import { realworldApi } from '~shared/api/realworld';
import { createWrapper } from '~shared/lib/react-query';
import { useDeleteArticle } from './deleteArticle';
import { setupDeleteArticleHandlers } from './msw/deleteArticleHandlers';

const slug =
  'Try-to-transmit-the-HTTP-card-maybe-it-will-override-the-multi-byte-hard-drive!-120863';

const deleteArticle = vi.spyOn(realworldApi.articles, 'deleteArticle');

describe('useDeleteArticle', () => {
  beforeEach(() => {
    setupDeleteArticleHandlers();
  });

  it('should delete an article successfully', async () => {
    const { result, rerender } = renderHook(() => useDeleteArticle(), {
      wrapper: createWrapper(),
    });

    const deleteArticlePromise = result.current.mutateAsync(slug);
    await expect(deleteArticlePromise).resolves.toBeDefined();
    rerender();

    expect(result.current.isSuccess).toBe(true);
    expect(deleteArticle).toBeCalledTimes(1);
    expect(deleteArticle).toHaveBeenCalledWith(slug);
    expect(result.current.data).toStrictEqual({});
  });

  it('should handle auth(401) error', async () => {
    realworldApi.setSecurityData(null);

    const { result, rerender } = renderHook(() => useDeleteArticle(), {
      wrapper: createWrapper(),
    });

    const deleteArticlePromise = result.current.mutateAsync(slug);
    await expect(deleteArticlePromise).rejects.toBeDefined();
    rerender();

    expect(result.current.isError).toBe(true);
    expect(result.current.error?.error).toStrictEqual({
      status: 'error',
      message: 'missing authorization credentials',
    });
  });

  it('should handle not found(404) error', async () => {
    const { result, rerender } = renderHook(() => useDeleteArticle(), {
      wrapper: createWrapper(),
    });

    const deleteArticlePromise = result.current.mutateAsync('invalid-slug');
    await expect(deleteArticlePromise).rejects.toBeDefined();
    rerender();

    expect(result.current.isError).toBe(true);
    expect(result.current.error?.error).toStrictEqual({
      errors: { article: ['not found'] },
    });
  });

  it('should handle not authorized(403) error', async () => {
    const { result, rerender } = renderHook(() => useDeleteArticle(), {
      wrapper: createWrapper(),
    });

    const deleteArticlePromise = result.current.mutateAsync(
      'If-we-quantify-the-alarm-we-can-get-to-the-FTP-pixel-through-the-online-SSL-interface!-120863',
    );
    await expect(deleteArticlePromise).rejects.toBeDefined();
    rerender();

    expect(result.current.isError).toBe(true);
    expect(result.current.error?.error).toStrictEqual({
      status: 'error',
      message: 'You are not authorized to delete this article',
    });
  });
});
