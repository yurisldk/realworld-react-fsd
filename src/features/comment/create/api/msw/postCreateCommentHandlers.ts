import { rest } from 'msw';
import {
  server,
  initTestDatabase,
  parseTokenFromRequest,
  mapMswCommentDto,
} from '~shared/api/msw';
import { NewCommentDto, realworldApi } from '~shared/api/realworld';

const databaseApi = initTestDatabase();

const postCreateArticleHandlers = [
  rest.post(
    `${realworldApi.baseUrl}/articles/:slug/comments`,
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

      const { comment: newComment } = await req.json<{
        comment: NewCommentDto;
      }>();

      const mswComment = {
        id: String(databaseApi.comment.count() + 1),
        createdAt: new Date(Date.now()).toISOString(),
        updatedAt: new Date(Date.now()).toISOString(),
        body: newComment.body,
        authorId: maybeUser.username,
        articleId: String(slug),
      };

      try {
        const maybeComment = databaseApi.comment.create(mswComment);
        const maybeProfile = databaseApi.profile.findFirst({
          where: { username: { equals: maybeUser.username } },
        });

        const commentDto = mapMswCommentDto(
          maybeComment,
          maybeUser,
          maybeProfile,
        );

        return await res(ctx.status(200), ctx.json({ comment: commentDto }));
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
    },
  ),
];

export const setupPostCreateArticleHandlers = () => {
  server.use(...postCreateArticleHandlers);
};
