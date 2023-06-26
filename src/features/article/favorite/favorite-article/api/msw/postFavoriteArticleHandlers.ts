import { rest } from 'msw';
import { realworldApi } from '~shared/api/realworld';
import {
  server,
  initTestDatabase,
  parseTokenFromRequest,
  mapMswArticleDto,
} from '~shared/lib/msw';

const databaseApi = initTestDatabase();

const postFavoriteArticleHandlers = [
  rest.post(
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
            favoritedBy: [...maybeArticle.favoritedBy, maybeUser.username],
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

export const setupPostFavoriteArticleHandlers = () => {
  server.use(...postFavoriteArticleHandlers);
};
