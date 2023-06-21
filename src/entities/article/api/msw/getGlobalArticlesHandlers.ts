import { rest } from 'msw';
import { realworldApi } from '~shared/api/realworld';
import { server, initTestDatabase } from '~shared/lib/msw';

const databaseApi = initTestDatabase();

// TODO: add params cases
const getGlobalArticlesHandlers = [
  rest.get(`${realworldApi.baseUrl}/articles`, (req, res, ctx) => {
    // const tag = req.url.searchParams.get('tag');
    // const author = req.url.searchParams.get('author');
    // const favorited = req.url.searchParams.get('favorited');
    const offset = Number(req.url.searchParams.get('offset'));
    const limit = Number(req.url.searchParams.get('limit'));

    const articles = databaseApi.article.findMany({
      take: limit,
      skip: offset,
    });

    const articlesCount = databaseApi.article.count();

    return res(
      ctx.status(200),
      ctx.json({
        articles,
        articlesCount,
      }),
    );
  }),
];

export const setupGetGlobalArticlesHandlers = () => {
  server.use(...getGlobalArticlesHandlers);
};
