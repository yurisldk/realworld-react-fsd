import { rest } from 'msw';
import { realworldApi } from '~shared/api/realworld';
import {
  server,
  initTestDatabase,
  parseTokenFromRequest,
} from '~shared/lib/msw';

const databaseApi = initTestDatabase();

const getUserArticlesHandlers = [
  rest.get(`${realworldApi.baseUrl}/articles/feed`, (req, res, ctx) => {
    const token = parseTokenFromRequest(req);

    if (!token)
      return res(
        ctx.status(401),
        ctx.json({
          status: 'error',
          message: 'missing authorization credentials',
        }),
      );

    const user = databaseApi.user.findFirst({
      where: { token: { equals: token } },
    });

    const offset = Number(req.url.searchParams.get('offset'));
    const limit = Number(req.url.searchParams.get('limit'));

    const articles = databaseApi.article.findMany({
      where: {
        author: {
          username: {
            in: user?.followsAuthors.map((author) => author.username),
          },
        },
      },
      take: limit,
      skip: offset,
    });

    const articlesCount = articles.length;

    return res(
      ctx.status(200),
      ctx.json({
        articles,
        articlesCount,
      }),
    );
  }),
];

export const setupGetUserArticlesHandlers = () => {
  server.use(...getUserArticlesHandlers);
};
