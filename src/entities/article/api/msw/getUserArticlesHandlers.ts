import { rest } from 'msw';
import { realworldApi } from '~shared/api/realworld';
import {
  server,
  initTestDatabase,
  parseTokenFromRequest,
  mapMswArticleDto,
} from '~shared/lib/msw';

const databaseApi = initTestDatabase();

const getUserArticlesHandlers = [
  rest.get(`${realworldApi.baseUrl}/articles/feed`, (req, res, ctx) => {
    const offset = Number(req.url.searchParams.get('offset'));
    const limit = Number(req.url.searchParams.get('limit'));

    const token = parseTokenFromRequest(req);
    const maybeUser = databaseApi.user.findFirst({
      where: { token: { equals: token } },
    });

    if (!maybeUser)
      return res(
        ctx.status(401),
        ctx.json({
          status: 'error',
          message: 'missing authorization credentials',
        }),
      );

    const articles = databaseApi.article.findMany({
      where: { authorId: { equals: maybeUser.username } },
      take: limit,
      skip: offset,
    });
    const articlesCount = databaseApi.article.count({
      where: { authorId: { equals: maybeUser.username } },
    });

    const articlesDto = articles.map((article) => {
      const maybeProfile = databaseApi.profile.findFirst({
        where: { username: { equals: article.authorId } },
      });

      return mapMswArticleDto(article, maybeUser, maybeProfile);
    });

    return res(
      ctx.status(200),
      ctx.json({
        articles: articlesDto,
        articlesCount,
      }),
    );
  }),
];

export const setupGetUserArticlesHandlers = () => {
  server.use(...getUserArticlesHandlers);
};
