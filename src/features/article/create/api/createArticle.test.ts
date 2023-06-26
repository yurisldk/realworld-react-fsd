import { renderHook } from '@testing-library/react';
import { vi } from 'vitest';
import { ArticleDto, NewArticleDto, realworldApi } from '~shared/api/realworld';
import { createWrapper } from '~shared/lib/react-query';
import { useCreateArticle } from '..';
import { setupPostCreateArticleHandlers } from './msw/postCreateArticleHandlers';

const newValidArticle: NewArticleDto = {
  title: 'Test Article',
  description: 'This is a test description.',
  body: 'This is a test body.',
  tagList: ['tag #1', 'tag #2'],
};

const newInvalidArticle = {
  title: 'Test Article2',
  description: null,
  body: 'This is a test body.',
  tagList: ['tag #1', 'tag #2'],
};

const mockApiResponse: ArticleDto = {
  slug: 'test-article',
  title: 'Test Article',
  description: 'This is a test description.',
  body: 'This is a test body.',
  createdAt: '2023-06-23T00:00:00.000Z',
  updatedAt: '2023-06-23T00:00:00.000Z',
  tagList: ['tag #1', 'tag #2'],
  favorited: false,
  favoritesCount: 0,
  author: {
    username: 'Jake',
    bio: 'I work at statefarm',
    image: 'https://api.realworld.io/images/smiley-cyrus.jpeg',
    following: false,
  },
};

const createArticle = vi.spyOn(realworldApi.articles, 'createArticle');

describe('useCreateArticle', () => {
  beforeEach(() => {
    vi.useFakeTimers({ toFake: ['Date'] });
    setupPostCreateArticleHandlers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('should create a new article successfully', async () => {
    const date = new Date(Date.UTC(2023, 5, 23));
    vi.setSystemTime(date);

    const { result, rerender } = renderHook(() => useCreateArticle(), {
      wrapper: createWrapper(),
    });

    const createArticlePromise = result.current.mutateAsync(newValidArticle);
    await expect(createArticlePromise).resolves.toBeDefined();
    rerender();

    expect(result.current.isSuccess).toBe(true);
    expect(createArticle).toBeCalledTimes(1);
    expect(createArticle).toHaveBeenCalledWith({ article: newValidArticle });
    expect(result.current.data).toStrictEqual(mockApiResponse);
  });

  it('should handle auth(401) error', async () => {
    realworldApi.setSecurityData(null);

    const { result, rerender } = renderHook(() => useCreateArticle(), {
      wrapper: createWrapper(),
    });

    const createArticlePromise = result.current.mutateAsync(newValidArticle);
    await expect(createArticlePromise).rejects.toBeDefined();
    rerender();

    expect(result.current.isError).toBe(true);
    expect(result.current.error?.error).toStrictEqual({
      status: 'error',
      message: 'missing authorization credentials',
    });
  });

  it('should handle database(422) error', async () => {
    const { result, rerender } = renderHook(() => useCreateArticle(), {
      wrapper: createWrapper(),
    });

    // @ts-expect-error not assignable to parameter of type 'NewArticleDto'
    const createArticlePromise = result.current.mutateAsync(newInvalidArticle);
    await expect(createArticlePromise).rejects.toBeDefined();
    rerender();

    expect(result.current.isError).toBe(true);
    expect(result.current.error?.error).toStrictEqual({
      errors: { database: { name: 'Invariant Violation' } },
    });
  });
});
