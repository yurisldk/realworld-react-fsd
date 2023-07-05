import { QueryClient } from '@tanstack/react-query';
import { renderHook } from '@testing-library/react';
import { act } from 'react-dom/test-utils';
import { vi } from 'vitest';
import { articleApi } from '~entities/article';
import { wait } from '~shared/api/msw';
import { ArticleDto, realworldApi } from '~shared/api/realworld';
import { createWrapper } from '~shared/lib/react-query';
import { setupDeleteUnfavoriteArticleHandlers } from './msw/deleteUnfavoriteArticleHandlers';
import { useMutationUnfavoriteArticle } from './unfavoriteArticle';

const newArticle: ArticleDto = {
  slug: 'Ill-synthesize-the-primary-AI-capacitor-that-should-array-the-JBOD-sensor!-120863',
  title:
    'Ill synthesize the primary AI capacitor, that should array the JBOD sensor!',
  description:
    'Perspiciatis illum illum et et error labore ut iure. Eius quidem eius placeat blanditiis in et deserunt. Eligendi fugiat vero nam asperiores sequi sit dignissimos. Quam rerum consequuntur dolor.',
  body: 'Pariatur quo neque est perspiciatis non illo rerum expedita minima.\\nEt commodi voluptas eos ex.\\nUnde velit delectus deleniti deleniti non in sit.\\nAliquid voluptatem magni. Ut in omnis sapiente laboriosam autem laborum.\\nRepellendus et beatae qui qui numquam saepe.\\nNon vitae molestias quos illum.\\nSed fugiat qui ullam molestias ad ullam dolore.\\nAutem ex minus distinctio dicta sapiente beatae veritatis at. Dicta quia molestias natus est.\\nSit animi inventore a ut ut suscipit.\\nEos et et commodi eligendi nihil.\\nEa reprehenderit consectetur eum. Autem sed aspernatur aut sint ipsam et facere rerum voluptas.\\nPerferendis eligendi molestias laudantium eveniet eos.\\nId veniam asperiores quis voluptates aut deserunt.\\nTempora et eius dignissimos nulla iusto et omnis pariatur.\\nSit mollitia eum blanditiis suscipit. Et fuga repellendus magnam dignissimos eius aspernatur rerum. Dolorum eius dignissimos et magnam voluptate aut voluptatem natus.\\nAut sint est eum molestiae consequatur officia omnis.\\nQuae et quam odit voluptatum itaque ducimus magni dolores ab.\\nDolorum sed iure voluptatem et reiciendis. Ad voluptate vel.\\nAut aut dolor. Facere consequatur ullam.\\nSint illum iste ab et saepe sit ut quis voluptatibus.\\nQuo esse dolorum a quasi nihil.\\nError quo eveniet.\\nQuia aut rem quia in iste fugit ad. Voluptas aut occaecati cum et quia quam.\\nBeatae libero doloribus nesciunt iusto.\\nDolores vitae neque quisquam qui ipsa ut aperiam. Deserunt ab porro similique est accusamus id enim aut suscipit.\\nSoluta reprehenderit error nesciunt odit veniam sed.\\nDolore optio qui aut ab.\\nAut minima provident eius repudiandae a quibusdam in nisi quam.',
  tagList: ['possimus', 'eos', 'omnis', 'laborum'],
  createdAt: '2022-12-09T13:46:24.262Z',
  updatedAt: '2022-12-09T13:46:24.262Z',
  favorited: false,
  favoritesCount: 0,
  author: {
    username: 'Anah Benešová',
    bio: 'I work at statefarm',
    image: 'https://api.realworld.io/images/demo-avatar.png',
    following: true,
  },
};

const rolledBackArticle: ArticleDto = {
  ...newArticle,
  favorited: true,
  favoritesCount: 1,
};

const queryKey = articleApi.articleKeys.article.slug(newArticle.slug);

type Params = Parameters<typeof realworldApi.articles.deleteArticleFavorite>;
type Return = ReturnType<typeof realworldApi.articles.deleteArticleFavorite>;

const mockedDeleteArticleFavorite = vi
  .fn<Params, Return>()
  .mockImplementation(realworldApi.articles.deleteArticleFavorite);

const deleteArticleFavorite = vi
  .spyOn(realworldApi.articles, 'deleteArticleFavorite')
  .mockImplementation(
    (...args: Params): Return =>
      mockedDeleteArticleFavorite(...args).then((value) => wait(1000, value)),
  );

describe('useMutationUnfavoriteArticle', () => {
  let queryClient: QueryClient;

  beforeEach(() => {
    queryClient = new QueryClient();
    vi.useFakeTimers();
    setupDeleteUnfavoriteArticleHandlers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('should update an article successfully', async () => {
    const { result } = renderHook(
      () => useMutationUnfavoriteArticle(queryClient),
      { wrapper: createWrapper() },
    );

    const deleteArticleFavoritePromise = result.current.mutateAsync(newArticle);

    await act(async () => vi.advanceTimersToNextTimerAsync());

    const cachedData = queryClient.getQueryData(queryKey);
    expect(cachedData).toEqual(newArticle);

    await act(async () => vi.runAllTimersAsync());

    await expect(deleteArticleFavoritePromise).resolves.toBeDefined();
    expect(result.current.isSuccess).toBe(true);
    expect(deleteArticleFavorite).toBeCalledTimes(1);
    expect(deleteArticleFavorite).toHaveBeenCalledWith(newArticle.slug);
    expect(result.current.data).toStrictEqual(newArticle);
  });

  it('should rollback article on mutation error', async () => {
    realworldApi.setSecurityData(null);

    const { result, rerender } = renderHook(
      () => useMutationUnfavoriteArticle(queryClient),
      { wrapper: createWrapper() },
    );

    const deleteArticleFavoritePromise = result.current.mutateAsync(newArticle);
    await expect(deleteArticleFavoritePromise).rejects.toBeDefined();
    rerender();

    const cachedData = queryClient.getQueryData(queryKey);
    expect(deleteArticleFavorite).toHaveBeenCalledWith(newArticle.slug);
    expect(cachedData).toEqual(rolledBackArticle);
    expect(result.current.error).toBeDefined();
  });

  it('should handle auth(401) error', async () => {
    realworldApi.setSecurityData(null);

    const { result, rerender } = renderHook(
      () => useMutationUnfavoriteArticle(queryClient),
      { wrapper: createWrapper() },
    );

    const deleteArticleFavoritePromise = result.current.mutateAsync(newArticle);
    await expect(deleteArticleFavoritePromise).rejects.toBeDefined();
    rerender();

    expect(result.current.isError).toBe(true);
    expect(result.current.error?.error).toStrictEqual({
      status: 'error',
      message: 'missing authorization credentials',
    });
  });

  it('should handle not found(404) error', async () => {
    const { result, rerender } = renderHook(
      () => useMutationUnfavoriteArticle(queryClient),
      { wrapper: createWrapper() },
    );

    const deleteArticleFavoritePromise = result.current.mutateAsync({
      ...newArticle,
      slug: 'invalid-slug',
    });
    await expect(deleteArticleFavoritePromise).rejects.toBeDefined();
    rerender();

    expect(result.current.isError).toBe(true);
    expect(result.current.error?.error).toStrictEqual({
      errors: { article: ['not found'] },
    });
  });
});
