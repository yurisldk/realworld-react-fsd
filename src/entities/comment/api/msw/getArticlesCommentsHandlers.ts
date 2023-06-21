import { rest } from 'msw';
import { realworldApi } from '~shared/api/realworld';
import { server, initTestDatabase } from '~shared/lib/msw';

const databaseApi = initTestDatabase();

const getArticlesCommentsHandlers = [
  rest.get(
    `${realworldApi.baseUrl}/articles/:slug/comments`,
    (req, res, ctx) => {
      const { slug } = req.params;

      const maybeArticle = databaseApi.article.findFirst({
        where: { slug: { equals: String(slug) } },
      });

      if (!maybeArticle)
        return res(
          ctx.status(404),
          ctx.json({ errors: { comments: ['not found'] } }),
        );

      const articleComments = maybeArticle.comments;

      const comments = databaseApi.comment.findMany({
        where: {
          id: {
            in: articleComments?.map((articleComment) => articleComment.id),
          },
        },
      });

      return res(ctx.status(200), ctx.json({ comments }));
    },
  ),
];

export const setupGetArticlesCommentsHandlers = () => {
  server.use(...getArticlesCommentsHandlers);
};
