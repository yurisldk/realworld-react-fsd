import { rest } from 'msw';
import { realworldApi } from '~shared/api/realworld';
import {
  server,
  initTestDatabase,
  parseTokenFromRequest,
  mapMswArticleDto,
} from '~shared/lib/msw';

const databaseApi = initTestDatabase();

const getSingleArticleHandlers = [
  rest.get(`${realworldApi.baseUrl}/articles/:slug`, (req, res, ctx) => {
    const { slug } = req.params;

    const maybeArticle = databaseApi.article.findFirst({
      where: { slug: { equals: String(slug) } },
    });

    if (!maybeArticle)
      return res(
        ctx.status(404),
        ctx.json({ errors: { article: ['not found'] } }),
      );

    const token = parseTokenFromRequest(req);
    const maybeUser = databaseApi.user.findFirst({
      where: { token: { equals: token } },
    });

    const maybeProfile = databaseApi.profile.findFirst({
      where: { username: { equals: maybeArticle.authorId } },
    });

    const articleDto = mapMswArticleDto(maybeArticle, maybeUser, maybeProfile);

    return res(ctx.status(200), ctx.json({ article: articleDto }));
  }),
];

export const setupGetSingleArticleHandlers = () => {
  server.use(...getSingleArticleHandlers);
};
