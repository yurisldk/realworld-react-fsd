import { rest } from 'msw';
import {
  server,
  initTestDatabase,
  parseTokenFromRequest,
} from '~shared/api/msw';
import { realworldApi } from '~shared/api/realworld';

const databaseApi = initTestDatabase();

const deleteArticleHandlers = [
  rest.delete(
    `${realworldApi.baseUrl}/articles/:slug`,
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

      if (maybeUser.username !== maybeArticle.authorId) {
        return res(
          ctx.status(403),
          ctx.json({
            status: 'error',
            message: 'You are not authorized to delete this article',
          }),
        );
      }

      try {
        databaseApi.article.delete({
          where: { slug: { equals: String(slug) } },
        });

        return await res(ctx.status(200), ctx.json({}));
        /* c8 ignore start */
      } catch (error) {
        return res(
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

export const setupDeleteArticleHandlers = () => {
  server.use(...deleteArticleHandlers);
};
