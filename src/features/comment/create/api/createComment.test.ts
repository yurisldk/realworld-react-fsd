import { QueryClient } from '@tanstack/react-query';
import { renderHook } from '@testing-library/react';
import { act } from 'react-dom/test-utils';
import { vi } from 'vitest';
import { commentApi } from '~entities/comment';
import { wait } from '~shared/api/msw';
import { realworldApi } from '~shared/api/realworld';
import { createWrapper } from '~shared/lib/react-query';
import { useCreateComment } from './createComment';
import { setupPostCreateArticleHandlers } from './msw/postCreateCommentHandlers';

const slug =
  'If-we-quantify-the-alarm-we-can-get-to-the-FTP-pixel-through-the-online-SSL-interface!-120863';

const newComment: commentApi.Comment = {
  id: 3,
  createdAt: '2023-06-23T00:00:00.000Z',
  updatedAt: '2023-06-23T00:00:00.000Z',
  body: 'test comment',
  author: {
    username: 'Jake',
    bio: 'I work at statefarm',
    image: 'https://api.realworld.io/images/smiley-cyrus.jpeg',
    following: false,
  },
};

type Params = Parameters<typeof realworldApi.articles.createArticleComment>;
type Return = ReturnType<typeof realworldApi.articles.createArticleComment>;

const mockedCreateArticleComment = vi
  .fn<Params, Return>()
  .mockImplementation(realworldApi.articles.createArticleComment);

const createArticleComment = vi
  .spyOn(realworldApi.articles, 'createArticleComment')
  .mockImplementation(
    (...args: Params): Return =>
      mockedCreateArticleComment(...args).then((value) => wait(1000, value)),
  );

const queryKey = commentApi.commentKeys.comments.slug(slug);

describe('useCreateComment', () => {
  let queryClient: QueryClient;

  beforeEach(() => {
    queryClient = new QueryClient();
    vi.useFakeTimers();
    setupPostCreateArticleHandlers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('should create a new comment successfully', async () => {
    const date = new Date(Date.UTC(2023, 5, 23));
    vi.setSystemTime(date);

    const { result } = renderHook(() => useCreateComment(queryClient), {
      wrapper: createWrapper(),
    });

    const createCommentPromise = result.current.mutateAsync({
      slug,
      newComment,
    });
    // result.current.status === idle

    await act(async () => vi.advanceTimersToNextTimerAsync());
    // result.current.status === loading

    const cachedData = queryClient.getQueryData(queryKey);
    expect(cachedData).toEqual([newComment]);

    await act(async () => vi.runAllTimersAsync());
    // result.current.status === success

    await expect(createCommentPromise).resolves.toBeDefined();
    expect(result.current.isSuccess).toBe(true);
    expect(createArticleComment).toBeCalledTimes(1);
    expect(createArticleComment).toHaveBeenCalledWith(slug, {
      comment: { body: 'test comment' },
    });
    expect(result.current.data).toStrictEqual(newComment);
  });

  it('should rollback comment on mutation error', async () => {
    realworldApi.setSecurityData(null);

    const { result, rerender } = renderHook(
      () => useCreateComment(queryClient),
      { wrapper: createWrapper() },
    );

    const createCommentPromise = result.current.mutateAsync({
      slug,
      newComment,
    });
    await expect(createCommentPromise).rejects.toBeDefined();
    rerender();

    const cachedData = queryClient.getQueryData(queryKey);
    expect(createArticleComment).toHaveBeenCalledWith(slug, {
      comment: { body: 'test comment' },
    });
    expect(cachedData).toEqual([]);
    expect(result.current.error).toBeDefined();
  });

  it('should handle auth(401) error', async () => {
    realworldApi.setSecurityData(null);

    const { result, rerender } = renderHook(
      () => useCreateComment(queryClient),
      { wrapper: createWrapper() },
    );

    const createCommentPromise = result.current.mutateAsync({
      slug,
      newComment,
    });
    await expect(createCommentPromise).rejects.toBeDefined();
    rerender();

    expect(result.current.isError).toBe(true);
    expect(result.current.error?.error).toStrictEqual({
      status: 'error',
      message: 'missing authorization credentials',
    });
  });

  it('should handle database(422) error', async () => {
    const { result, rerender } = renderHook(
      () => useCreateComment(queryClient),
      { wrapper: createWrapper() },
    );

    const createCommentPromise = result.current.mutateAsync({
      slug,
      // @ts-expect-error Type 'null' is not assignable to type 'number'
      newComment: { ...newComment, body: null },
    });
    await expect(createCommentPromise).rejects.toBeDefined();
    rerender();

    expect(result.current.isError).toBe(true);
    expect(result.current.error?.error).toStrictEqual({
      errors: { database: { name: 'Invariant Violation' } },
    });
  });
});
