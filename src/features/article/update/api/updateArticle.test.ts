import { renderHook } from '@testing-library/react';
import { vi } from 'vitest';
import {
  ArticleDto,
  UpdateArticleDto,
  realworldApi,
} from '~shared/api/realworld';
import { createWrapper } from '~shared/lib/react-query';
import { setupPutUpdateArticleHandlers } from './msw/putUpdateArticleHandlers';
import { useUpdateArticle } from './updateArticle';

const article: ArticleDto = {
  slug: 'Try-to-transmit-the-HTTP-card-maybe-it-will-override-the-multi-byte-hard-drive!-120863',
  title:
    'Try to transmit the HTTP card, maybe it will override the multi-byte hard drive!',
  description:
    'Assumenda molestiae laboriosam enim ipsum quaerat enim officia vel quo. Earum odit rem natus totam atque cumque. Sint dolorem facere non.',
  body: 'Sunt excepturi ut dolore fuga.\\nAutem eum maiores aut nihil magnam corporis consectetur sit. Voluptate et quasi optio eos et eveniet culpa et nobis.\\nSint aut sint sequi possimus reiciendis nisi.\\nRerum et omnis et sit doloribus corporis voluptas error.\\nIusto molestiae tenetur necessitatibus dolorem omnis. Libero sed ut architecto.\\nEx itaque et modi aut voluptatem alias quae.\\nModi dolor cupiditate sit.\\nDelectus consectetur nobis aliquid deserunt sint ut et voluptas.\\nCorrupti in labore laborum quod. Ipsa laudantium deserunt. Ut atque harum inventore natus facere sed molestiae.\\nQuia aliquid ut.\\nAnimi sunt rem et sit ullam dolorem ab consequatur modi. Cupiditate officia voluptatum.\\nTenetur facere eum distinctio animi qui laboriosam.\\nQuod sed voluptatem et cumque est eos.\\nSint id provident suscipit harum odio et. Et fuga repellendus magnam dignissimos eius aspernatur rerum. Quo perferendis nesciunt.\\nDolore dolorem porro omnis voluptatibus consequuntur et expedita suscipit et.\\nTempora facere ipsa.\\nDolore accusamus soluta officiis eligendi.\\nEum quaerat neque eum beatae odio. Ad voluptate vel.\\nAut aut dolor. Cupiditate officia voluptatum.\\nTenetur facere eum distinctio animi qui laboriosam.\\nQuod sed voluptatem et cumque est eos.\\nSint id provident suscipit harum odio et.',
  tagList: ['voluptate', 'rerum', 'ducimus', 'hic'],
  createdAt: '2022-12-09T13:46:24.264Z',
  updatedAt: '2022-12-09T13:46:24.264Z',
  favorited: false,
  favoritesCount: 0,
  author: {
    username: 'Jake',
    bio: 'I work at statefarm',
    image: 'https://api.realworld.io/images/smiley-cyrus.jpeg',
    following: false,
  },
};

const updatedArticle: UpdateArticleDto = {
  description: 'updated description',
  body: 'updated body',
};

const expectedArticle: ArticleDto = {
  ...article,
  ...updatedArticle,
  updatedAt: '2023-06-23T00:00:00.000Z',
};

const updateArticle = vi.spyOn(realworldApi.articles, 'updateArticle');

describe('useUpdateArticle', () => {
  beforeEach(() => {
    vi.useFakeTimers({ toFake: ['Date'] });
    setupPutUpdateArticleHandlers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('should update an article successfully', async () => {
    const date = new Date(Date.UTC(2023, 5, 23));
    vi.setSystemTime(date);

    const { result, rerender } = renderHook(() => useUpdateArticle(), {
      wrapper: createWrapper(),
    });

    const updateArticlePromise = result.current.mutateAsync({
      slug: article.slug,
      article: updatedArticle,
    });
    rerender();

    await expect(updateArticlePromise).resolves.toBeDefined();
    rerender();

    expect(result.current.isSuccess).toBe(true);
    expect(updateArticle).toBeCalledTimes(1);
    expect(updateArticle).toHaveBeenCalledWith(article.slug, {
      article: updatedArticle,
    });
    expect(result.current.data).toStrictEqual(expectedArticle);
  });

  it('should handle auth(401) error', async () => {
    realworldApi.setSecurityData(null);

    const { result, rerender } = renderHook(() => useUpdateArticle(), {
      wrapper: createWrapper(),
    });

    const updateArticlePromise = result.current.mutateAsync({
      slug: article.slug,
      article: updatedArticle,
    });
    rerender();

    await expect(updateArticlePromise).rejects.toBeDefined();
    rerender();

    expect(result.current.isError).toBe(true);
    expect(result.current.error?.error).toStrictEqual({
      status: 'error',
      message: 'missing authorization credentials',
    });
  });

  it('should handle not found(404) error', async () => {
    const { result, rerender } = renderHook(() => useUpdateArticle(), {
      wrapper: createWrapper(),
    });

    const updateArticlePromise = result.current.mutateAsync({
      slug: 'invalid-slug',
      article: updatedArticle,
    });
    rerender();

    await expect(updateArticlePromise).rejects.toBeDefined();
    rerender();

    expect(result.current.isError).toBe(true);
    expect(result.current.error?.error).toStrictEqual({
      errors: { article: ['not found'] },
    });
  });

  it('should handle not authorized(403) error', async () => {
    const { result, rerender } = renderHook(() => useUpdateArticle(), {
      wrapper: createWrapper(),
    });

    const updateArticlePromise = result.current.mutateAsync({
      slug: 'Ill-synthesize-the-primary-AI-capacitor-that-should-array-the-JBOD-sensor!-120863',
      article: updatedArticle,
    });
    rerender();

    await expect(updateArticlePromise).rejects.toBeDefined();
    rerender();

    expect(result.current.isError).toBe(true);
    expect(result.current.error?.error).toStrictEqual({
      status: 'error',
      message: 'You are not authorized to update this article',
    });
  });
});
