import { rest } from 'msw';
import {
  server,
  initTestDatabase,
  parseTokenFromRequest,
  mapMswProfileDto,
} from '~shared/api/msw';
import { realworldApi } from '~shared/api/realworld';

const databaseApi = initTestDatabase();

const getArticlesCommentsHandlers = [
  rest.get(
    `${realworldApi.baseUrl}/articles/:slug/comments`,
    (req, res, ctx) => {
      const { slug } = req.params;

      const comments = databaseApi.comment.findMany({
        where: { articleId: { equals: String(slug) } },
      });

      const token = parseTokenFromRequest(req);
      const maybeUser = databaseApi.user.findFirst({
        where: { token: { equals: token } },
      });

      const commentsDto = comments.map((curComment) => {
        const { articleId, authorId, ...comment } = curComment;

        const maybeProfile = databaseApi.profile.findFirst({
          where: { username: { equals: authorId } },
        });

        const author = mapMswProfileDto(maybeUser, maybeProfile);

        return {
          ...comment,
          author,
        };
      });

      return res(ctx.status(200), ctx.json({ comments: commentsDto }));
    },
  ),
];

export const setupGetArticlesCommentsHandlers = () => {
  server.use(...getArticlesCommentsHandlers);
};
