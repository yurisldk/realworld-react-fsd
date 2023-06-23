import { renderHook, waitFor } from '@testing-library/react';
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

describe('useCreateArticle', () => {
  beforeEach(() => {
    realworldApi.setSecurityData('jwt.token');
    vi.useFakeTimers({ toFake: ['Date'] });
    vi.spyOn(realworldApi.articles, 'createArticle');
    setupPostCreateArticleHandlers();
  });

  afterEach(() => {
    realworldApi.setSecurityData(null);
    vi.useRealTimers();
    vi.clearAllMocks();
  });

  it('should create a new article successfully', async () => {
    const date = new Date(Date.UTC(2023, 5, 23));
    vi.setSystemTime(date);

    const { result } = renderHook(() => useCreateArticle(), {
      wrapper: createWrapper(),
    });

    const { mutateAsync } = result.current;
    await waitFor(() => mutateAsync(newValidArticle));
    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(realworldApi.articles.createArticle).toHaveBeenCalledWith({
      article: newValidArticle,
    });

    expect(result.current.data).toStrictEqual(mockApiResponse);
  });

  it('should handle errors during article creation', async () => {
    const { result } = renderHook(() => useCreateArticle(), {
      wrapper: createWrapper(),
    });

    const { mutateAsync } = result.current;

    try {
      // @ts-expect-error not assignable to parameter of type 'NewArticleDto'
      await waitFor(() => mutateAsync(newInvalidArticle));
    } catch {
      expect(realworldApi.articles.createArticle).toHaveBeenCalledWith({
        article: newInvalidArticle,
      });
      expect(result.current.error).toBeDefined();
    }
  });
});
