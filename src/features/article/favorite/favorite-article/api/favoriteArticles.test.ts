import { QueryClient } from '@tanstack/react-query';
import { act, renderHook } from '@testing-library/react';
import { vi } from 'vitest';
import { articleApi } from '~entities/article';
import { wait } from '~shared/api/msw';
import { ArticleDto, realworldApi } from '~shared/api/realworld';
import { createWrapper } from '~shared/lib/react-query';
import { useMutationFavoriteArticle } from './favoriteArticle';
import { setupPostFavoriteArticleHandlers } from './msw/postFavoriteArticleHandlers';

const newArticle: ArticleDto = {
  slug: 'If-we-quantify-the-alarm-we-can-get-to-the-FTP-pixel-through-the-online-SSL-interface!-120863',
  title:
    'If we quantify the alarm, we can get to the FTP pixel through the online SSL interface!',
  description:
    'Omnis perspiciatis qui quia commodi sequi modi. Nostrum quam aut cupiditate est facere omnis possimus. Tenetur similique nemo illo soluta molestias facere quo. Ipsam totam facilis delectus nihil quidem soluta vel est omnis.',
  body: 'Quia quo iste et aperiam voluptas consectetur a omnis et.\\nDolores et earum consequuntur sunt et.\\nEa nulla ab voluptatem dicta vel. Temporibus aut adipisci magnam aliquam eveniet nihil laudantium reprehenderit sit.\\nAspernatur cumque labore voluptates mollitia deleniti et. Quos pariatur tenetur.\\nQuasi omnis eveniet eos maiores esse magni possimus blanditiis.\\nQui incidunt sit quos consequatur aut qui et aperiam delectus.\\nPraesentium quas culpa.\\nEaque occaecati cumque incidunt et. Provident saepe omnis non molestiae natus et.\\nAccusamus laudantium hic unde voluptate et sunt voluptatem.\\nMollitia velit id eius mollitia occaecati repudiandae. Voluptatum tempora voluptas est odio iure odio dolorem.\\nVoluptatum est deleniti explicabo explicabo harum provident quis molestiae. Sed dolores nostrum quis. Aut ipsa et qui vel similique sed hic a.\\nVoluptates dolorem culpa nihil aut ipsam voluptatem. Cupiditate officia voluptatum.\\nTenetur facere eum distinctio animi qui laboriosam.\\nQuod sed voluptatem et cumque est eos.\\nSint id provident suscipit harum odio et. Facere beatae delectus ut.\\nPossimus voluptas perspiciatis voluptatem nihil sint praesentium.\\nSint est nihil voluptates nesciunt voluptatibus temporibus blanditiis.\\nOfficiis voluptatem earum sed. Deserunt ab porro similique est accusamus id enim aut suscipit.\\nSoluta reprehenderit error nesciunt odit veniam sed.\\nDolore optio qui aut ab.\\nAut minima provident eius repudiandae a quibusdam in nisi quam.',
  tagList: ['rerum', 'maiores', 'omnis', 'quae'],
  createdAt: '2022-12-09T13:46:24.264Z',
  updatedAt: '2022-12-09T13:46:24.264Z',
  favorited: true,
  favoritesCount: 1,
  author: {
    username: 'Anah Benešová',
    bio: 'I work at statefarm',
    image: 'https://api.realworld.io/images/demo-avatar.png',
    following: true,
  },
};

const rolledBackArticle: ArticleDto = {
  ...newArticle,
  favorited: false,
  favoritesCount: 0,
};

const queryKey = articleApi.articleKeys.article.slug(newArticle.slug);

type Params = Parameters<typeof realworldApi.articles.createArticleFavorite>;
type Return = ReturnType<typeof realworldApi.articles.createArticleFavorite>;

const mockedCreateArticleFavorite = vi
  .fn<Params, Return>()
  .mockImplementation(realworldApi.articles.createArticleFavorite);

const createArticleFavorite = vi
  .spyOn(realworldApi.articles, 'createArticleFavorite')
  .mockImplementation(
    (...args: Params): Return =>
      mockedCreateArticleFavorite(...args).then((value) => wait(1000, value)),
  );

describe('useMutationFavoriteArticle', () => {
  let queryClient: QueryClient;

  beforeEach(() => {
    queryClient = new QueryClient();
    vi.useFakeTimers();
    setupPostFavoriteArticleHandlers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('should update an article successfully', async () => {
    const { result } = renderHook(
      () => useMutationFavoriteArticle(queryClient),
      { wrapper: createWrapper() },
    );

    const createArticleFavoritePromise = result.current.mutateAsync(newArticle);

    await act(async () => vi.advanceTimersToNextTimerAsync());

    const cachedData = queryClient.getQueryData(queryKey);
    expect(cachedData).toEqual(newArticle);

    await act(async () => vi.runAllTimersAsync());

    await expect(createArticleFavoritePromise).resolves.toBeDefined();
    expect(result.current.isSuccess).toBe(true);
    expect(createArticleFavorite).toBeCalledTimes(1);
    expect(createArticleFavorite).toHaveBeenCalledWith(newArticle.slug);
    expect(result.current.data).toStrictEqual(newArticle);
  });

  it('should rollback article on mutation error', async () => {
    realworldApi.setSecurityData(null);

    const { result, rerender } = renderHook(
      () => useMutationFavoriteArticle(queryClient),
      { wrapper: createWrapper() },
    );

    const createArticleFavoritePromise = result.current.mutateAsync(newArticle);
    await expect(createArticleFavoritePromise).rejects.toBeDefined();
    rerender();

    const cachedData = queryClient.getQueryData(queryKey);
    expect(createArticleFavorite).toHaveBeenCalledWith(newArticle.slug);
    expect(cachedData).toEqual(rolledBackArticle);
    expect(result.current.error).toBeDefined();
  });

  it('should handle auth(401) error', async () => {
    realworldApi.setSecurityData(null);

    const { result, rerender } = renderHook(
      () => useMutationFavoriteArticle(queryClient),
      { wrapper: createWrapper() },
    );

    const createArticleFavoritePromise = result.current.mutateAsync(newArticle);
    await expect(createArticleFavoritePromise).rejects.toBeDefined();
    rerender();

    expect(result.current.isError).toBe(true);
    expect(result.current.error?.error).toStrictEqual({
      status: 'error',
      message: 'missing authorization credentials',
    });
  });

  it('should handle not found(404) error', async () => {
    const { result, rerender } = renderHook(
      () => useMutationFavoriteArticle(queryClient),
      { wrapper: createWrapper() },
    );

    const createArticleFavoritePromise = result.current.mutateAsync({
      ...newArticle,
      slug: 'invalid-slug',
    });
    await expect(createArticleFavoritePromise).rejects.toBeDefined();
    rerender();

    expect(result.current.isError).toBe(true);
    expect(result.current.error?.error).toStrictEqual({
      errors: { article: ['not found'] },
    });
  });
});
