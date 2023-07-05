import { QueryClient } from '@tanstack/react-query';
import { act, renderHook } from '@testing-library/react';
import { vi } from 'vitest';
import { commentApi } from '~entities/comment';
import { wait } from '~shared/api/msw';
import { CommentDto, realworldApi } from '~shared/api/realworld';
import { createWrapper } from '~shared/lib/react-query';
import { useDeleteComment } from './deleteComment';
import { setupdeleteCommentHandlers } from './msw/deleteCommentHandlers';

const slug =
  'If-we-quantify-the-alarm-we-can-get-to-the-FTP-pixel-through-the-online-SSL-interface!-120863';

const comment: CommentDto = {
  id: 1,
  createdAt: '2016-02-18T03:22:56.637Z',
  updatedAt: '2016-02-18T03:22:56.637Z',
  body: 'It takes a Jacobian',
  author: {
    username: 'Jake',
    bio: 'I work at statefarm',
    image: 'https://api.realworld.io/images/smiley-cyrus.jpeg',
    following: false,
  },
};

const queryKey = commentApi.commentKeys.comments.slug(slug);

type Params = Parameters<typeof realworldApi.articles.deleteArticleComment>;
type Return = ReturnType<typeof realworldApi.articles.deleteArticleComment>;

const mockedDeleteArticleComment = vi
  .fn<Params, Return>()
  .mockImplementation(realworldApi.articles.deleteArticleComment);

const deleteArticleComment = vi
  .spyOn(realworldApi.articles, 'deleteArticleComment')
  .mockImplementation(
    (...args: Params): Return =>
      mockedDeleteArticleComment(...args).then((value) => wait(1000, value)),
  );

describe('useDeleteComment', () => {
  let queryClient: QueryClient;

  beforeEach(() => {
    queryClient = new QueryClient();
    vi.useFakeTimers();
    setupdeleteCommentHandlers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('should delete a comment successfully', async () => {
    queryClient.setQueryData(queryKey, [comment]);

    const { result } = renderHook(() => useDeleteComment(queryClient), {
      wrapper: createWrapper(),
    });

    const deleteCommentPromise = result.current.mutateAsync({
      slug,
      id: comment.id,
    });

    await act(async () => vi.advanceTimersToNextTimerAsync());

    const cachedData = queryClient.getQueryData(queryKey);
    expect(cachedData).toEqual([]);

    await act(async () => vi.runAllTimersAsync());

    await expect(deleteCommentPromise).resolves.toBeDefined();
    expect(result.current.isSuccess).toBe(true);
    expect(deleteArticleComment).toBeCalledTimes(1);
    expect(deleteArticleComment).toHaveBeenCalledWith(slug, comment.id);
    expect(result.current.data).toStrictEqual({});
  });

  it('should rollback comment on mutation error', async () => {
    realworldApi.setSecurityData(null);
    queryClient.setQueryData(queryKey, [comment]);

    const { result, rerender } = renderHook(
      () => useDeleteComment(queryClient),
      { wrapper: createWrapper() },
    );

    const deleteCommentPromise = result.current.mutateAsync({
      slug,
      id: comment.id,
    });
    await expect(deleteCommentPromise).rejects.toBeDefined();
    rerender();

    const cachedData = queryClient.getQueryData(queryKey);
    expect(deleteArticleComment).toHaveBeenCalledWith(slug, comment.id);
    expect(cachedData).toEqual([comment]);
    expect(result.current.error).toBeDefined();
  });

  it('should handle auth(401) error', async () => {
    realworldApi.setSecurityData(null);

    const { result, rerender } = renderHook(
      () => useDeleteComment(queryClient),
      { wrapper: createWrapper() },
    );

    const deleteCommentPromise = result.current.mutateAsync({
      slug,
      id: comment.id,
    });
    await expect(deleteCommentPromise).rejects.toBeDefined();
    rerender();

    expect(result.current.isError).toBe(true);
    expect(result.current.error?.error).toStrictEqual({
      status: 'error',
      message: 'missing authorization credentials',
    });
  });

  it('should handle not found(404) error', async () => {
    const { result, rerender } = renderHook(
      () => useDeleteComment(queryClient),
      { wrapper: createWrapper() },
    );

    const deleteCommentPromise = result.current.mutateAsync({
      slug: 'invlid-slug',
      id: comment.id,
    });
    await expect(deleteCommentPromise).rejects.toBeDefined();
    rerender();

    expect(result.current.isError).toBe(true);
    expect(result.current.error?.error).toStrictEqual({
      errors: { comment: ['not found'] },
    });
  });

  it('should handle not authorized(403) error', async () => {
    const { result, rerender } = renderHook(
      () => useDeleteComment(queryClient),
      { wrapper: createWrapper() },
    );

    const deleteCommentPromise = result.current.mutateAsync({ slug, id: 2 });
    await expect(deleteCommentPromise).rejects.toBeDefined();
    rerender();

    expect(result.current.isError).toBe(true);
    expect(result.current.error?.error).toStrictEqual({
      status: 'error',
      message: 'You are not authorized to delete this comment',
    });
  });
});
