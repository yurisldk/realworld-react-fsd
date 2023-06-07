import { rest } from 'msw';
import { realworldApi } from '~shared/api/realworld';
import { server } from '~shared/lib/msw';

const feedArticlesDto = {
  articles: [
    {
      slug: 'how-to-train-your-dragon',
      title: 'How to train your dragon',
      description: 'Ever wonder how?',
      body: 'It takes a Jacobian',
      tagList: ['dragons', 'training'],
      createdAt: '2016-02-18T03:22:56.637Z',
      updatedAt: '2016-02-18T03:48:35.824Z',
      favorited: false,
      favoritesCount: 0,
      author: {
        username: 'jake',
        bio: 'I work at statefarm',
        image: 'https://i.stack.imgur.com/xHWG8.jpg',
        following: false,
      },
    },
    {
      slug: 'how-to-train-your-dragon-2',
      title: 'How to train your dragon 2',
      description: 'So toothless',
      body: 'It a dragon',
      tagList: ['dragons', 'training'],
      createdAt: '2016-02-18T03:22:56.637Z',
      updatedAt: '2016-02-18T03:48:35.824Z',
      favorited: false,
      favoritesCount: 0,
      author: {
        username: 'jake',
        bio: 'I work at statefarm',
        image: 'https://i.stack.imgur.com/xHWG8.jpg',
        following: false,
      },
    },
    {
      slug: 'how-to-train-your-dragon-3',
      title: 'How to train your dragon 3',
      description: 'So toothless',
      body: 'It a dragon',
      tagList: ['dragons', 'training'],
      createdAt: '2016-02-18T03:22:56.637Z',
      updatedAt: '2016-02-18T03:48:35.824Z',
      favorited: false,
      favoritesCount: 0,
      author: {
        username: 'jake',
        bio: 'I work at statefarm',
        image: 'https://i.stack.imgur.com/xHWG8.jpg',
        following: false,
      },
    },
  ],
  articlesCount: 3,
};

const getFeedArticlesHandlers = [
  rest.get(`${realworldApi.baseUrl}/articles/feed`, (req, res, ctx) => {
    const isAuth = req.headers.get('authorization')?.startsWith('Token ');

    const offset = Number(req.url.searchParams.get('offset'));
    const limit = Number(req.url.searchParams.get('limit'));

    const articles = feedArticlesDto.articles.slice(offset, limit + offset);

    if (isAuth)
      return res(
        ctx.status(200),
        ctx.json({
          articles,
          articlesCount: feedArticlesDto.articlesCount,
        }),
      );

    return res(
      ctx.status(401),
      ctx.json({
        status: 'error',
        message: 'missing authorization credentials',
      }),
    );
  }),
];

export const setupGetFeedArticlesHandlers = () => {
  server.use(...getFeedArticlesHandlers);
};
