import { renderHook, waitFor } from '@testing-library/react';
import { vi } from 'vitest';
import { realworldApi } from '~shared/api/realworld';
import { createWrapper } from '~shared/lib/react-query';
import { useDeleteArticle } from './deleteArticle';
import { setupPostDeleteArticleHandlers } from './msw/postDeleteArticleHandlers';

describe('useDeleteArticle', () => {
  beforeEach(() => {
    realworldApi.setSecurityData('jwt.token');
    vi.spyOn(realworldApi.articles, 'deleteArticle');
    setupPostDeleteArticleHandlers();
  });

  afterEach(() => {
    realworldApi.setSecurityData(null);
    vi.clearAllMocks();
  });

  it('should delete an article successfully', async () => {
    const slug =
      'Try-to-transmit-the-HTTP-card-maybe-it-will-override-the-multi-byte-hard-drive!-120863';

    const { result } = renderHook(() => useDeleteArticle(), {
      wrapper: createWrapper(),
    });

    const { mutateAsync } = result.current;
    await waitFor(() => mutateAsync(slug));
    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(realworldApi.articles.deleteArticle).toHaveBeenCalledWith(slug);
  });

  it('should handle a failed article deletion', async () => {
    const slug = 'invalid-slug';

    const { result } = renderHook(() => useDeleteArticle(), {
      wrapper: createWrapper(),
    });

    const { mutateAsync } = result.current;

    try {
      await waitFor(() => mutateAsync(slug));
    } catch {
      expect(realworldApi.articles.deleteArticle).toHaveBeenCalledWith(slug);
      expect(result.current.error).toBeDefined();
    }
  });
});
