/* eslint-disable no-promise-executor-return */
import { QueryClient } from '@tanstack/react-query';
import { act, renderHook, waitFor } from '@testing-library/react';
import { vi } from 'vitest';
import { articleApi } from '~entities/article';
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

type Args = Parameters<typeof realworldApi.articles.createArticleFavorite>;
type Return = ReturnType<typeof realworldApi.articles.createArticleFavorite>;

const createArticleFavoriteWithDelay = vi
  .fn<Args, Return>()
  .mockImplementation(realworldApi.articles.createArticleFavorite);

vi.spyOn(realworldApi.articles, 'createArticleFavorite').mockImplementation(
  (...args: Args): Return =>
    createArticleFavoriteWithDelay(...args).then(
      (res) => new Promise((resolve) => setTimeout(() => resolve(res), 1000)),
    ),
);

const delay = async (ms: number) =>
  new Promise((resolve) => {
    setTimeout(resolve, ms);
  });

describe('useMutateFavoriteArticle', () => {
  let queryClient: QueryClient;

  beforeEach(() => {
    queryClient = new QueryClient();
    vi.useFakeTimers({ toFake: ['setTimeout'] });
    realworldApi.setSecurityData('jwt.token');
    setupPostFavoriteArticleHandlers();
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.clearAllMocks();
    realworldApi.setSecurityData(null);
  });

  it('should update article favorited status and count on successful mutation', async () => {
    const { result } = renderHook(
      () => useMutationFavoriteArticle(queryClient),
      {
        wrapper: createWrapper(),
      },
    );

    await act(async () => {
      result.current.mutateAsync(newArticle);
    });

    expect(realworldApi.articles.createArticleFavorite).toHaveBeenCalledWith(
      newArticle.slug,
    );
    expect(
      queryClient.getQueryData<ArticleDto>(
        articleApi.articleKeys.article.slug(newArticle.slug),
      ),
    ).toEqual(newArticle);

    expect(
      queryClient.getQueryData<ArticleDto>(
        articleApi.articleKeys.article.slug(newArticle.slug),
      ),
    ).toEqual(newArticle);

    act(() => {
      vi.advanceTimersByTimeAsync(1100);
    });

    await act(async () => {
      await delay(1100);
    });

    expect(result.current.isSuccess).toBe(true);
    expect(result.current.data).toStrictEqual(newArticle);
  });

  it('should rollback article favorited status and count on mutation error', async () => {
    realworldApi.setSecurityData(null);
    vi.useRealTimers();

    const { result } = renderHook(
      () => useMutationFavoriteArticle(queryClient),
      {
        wrapper: createWrapper(),
      },
    );

    try {
      await waitFor(() => result.current.mutateAsync(newArticle));
    } catch (error) {
      expect(realworldApi.articles.createArticleFavorite).toHaveBeenCalledWith(
        newArticle.slug,
      );
      expect(
        queryClient.getQueryData<ArticleDto>(
          articleApi.articleKeys.article.slug(newArticle.slug),
        ),
      ).toEqual(rolledBackArticle);
      expect(result.current.error).toBeDefined();
    }
  });
});
