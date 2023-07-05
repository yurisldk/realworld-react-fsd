import { rest } from 'msw';
import {
  server,
  initTestDatabase,
  parseTokenFromRequest,
  mapMswArticleDto,
} from '~shared/api/msw';
import { UpdateArticleDto, realworldApi } from '~shared/api/realworld';

const databaseApi = initTestDatabase();

const putUpdateArticleHandlers = [
  rest.put(`${realworldApi.baseUrl}/articles/:slug`, async (req, res, ctx) => {
    const { slug } = req.params;

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

    const maybeArticle = databaseApi.article.findFirst({
      where: { slug: { equals: String(slug) } },
    });

    if (!maybeArticle)
      return res(
        ctx.status(404),
        ctx.json({ errors: { article: ['not found'] } }),
      );

    if (maybeUser.username !== maybeArticle.authorId) {
      return res(
        ctx.status(403),
        ctx.json({
          status: 'error',
          message: 'You are not authorized to update this article',
        }),
      );
    }

    const { article: newArticle } = await req.json<{
      article: UpdateArticleDto;
    }>();

    const mswArticle = {
      ...maybeArticle,
      ...newArticle,
      updatedAt: new Date(Date.now()).toISOString(),
    };

    try {
      const updatedArticle = databaseApi.article.update({
        where: { slug: { equals: String(slug) } },
        data: mswArticle,
      });
      const maybeProfile = databaseApi.profile.findFirst({
        where: { username: { equals: maybeUser.username } },
      });

      const articleDto = mapMswArticleDto(
        updatedArticle,
        maybeUser,
        maybeProfile,
      );

      return await res(ctx.status(200), ctx.json({ article: articleDto }));
      /* c8 ignore start */
    } catch (error) {
      return await res(
        ctx.status(422),
        ctx.json({
          errors: {
            database: error,
          },
        }),
      );
    }
    /* c8 ignore stop */
  }),
];

export const setupPutUpdateArticleHandlers = () => {
  server.use(...putUpdateArticleHandlers);
};
