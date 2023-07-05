import { rest } from 'msw';
import {
  server,
  initTestDatabase,
  parseTokenFromRequest,
  mapMswArticleDto,
} from '~shared/api/msw';
import { realworldApi } from '~shared/api/realworld';

const databaseApi = initTestDatabase();

const deleteUnfavoriteArticleHandlers = [
  rest.delete(
    `${realworldApi.baseUrl}/articles/:slug/favorite`,
    async (req, res, ctx) => {
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

      try {
        const mswArticle = databaseApi.article.update({
          where: { slug: { equals: String(slug) } },
          data: {
            ...maybeArticle,
            favoritedBy: maybeArticle.favoritedBy.filter(
              (username) => username !== maybeUser.username,
            ),
          },
        });
        const maybeProfile = databaseApi.profile.findFirst({
          where: { username: { equals: maybeArticle.authorId } },
        });

        const articleDto = mapMswArticleDto(
          mswArticle,
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
    },
  ),
];

export const setupDeleteUnfavoriteArticleHandlers = () => {
  server.use(...deleteUnfavoriteArticleHandlers);
};
