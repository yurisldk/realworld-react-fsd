import { rest } from 'msw';
import { realworldApi } from '~shared/api/realworld';
import {
  server,
  initTestDatabase,
  parseTokenFromRequest,
} from '~shared/lib/msw';

const databaseApi = initTestDatabase();

const deleteCommentHandlers = [
  rest.delete(
    `${realworldApi.baseUrl}/articles/:slug/comments/:id`,
    async (req, res, ctx) => {
      const { slug } = req.params;
      const { id } = req.params;

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

      const maybeComment = databaseApi.comment.findFirst({
        where: {
          id: { equals: String(id) },
          articleId: { equals: String(slug) },
        },
      });

      if (!maybeComment)
        return res(
          ctx.status(404),
          ctx.json({ errors: { comment: ['not found'] } }),
        );

      if (maybeUser.username !== maybeComment.authorId) {
        return res(
          ctx.status(403),
          ctx.json({
            status: 'error',
            message: 'You are not authorized to delete this comment',
          }),
        );
      }

      try {
        databaseApi.comment.delete({
          where: { id: { equals: String(id) } },
        });

        return await res(ctx.status(200), ctx.json({}));
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

export const setupdeleteCommentHandlers = () => {
  server.use(...deleteCommentHandlers);
};
