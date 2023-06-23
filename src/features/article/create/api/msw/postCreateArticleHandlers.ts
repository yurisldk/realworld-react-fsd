import dayjs from 'dayjs';
import { rest } from 'msw';
import { NewArticleDto, realworldApi } from '~shared/api/realworld';
import {
  server,
  initTestDatabase,
  parseTokenFromRequest,
  mapMswArticleDto,
} from '~shared/lib/msw';

const databaseApi = initTestDatabase();

const postCreateArticleHandlers = [
  rest.post(`${realworldApi.baseUrl}/articles`, async (req, res, ctx) => {
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

    const { article: newArticle } = await req.json<{
      article: NewArticleDto;
    }>();

    const slug = newArticle.title.split(' ').join('-').toLowerCase();

    const mswArticle = {
      ...newArticle,
      slug,
      createdAt: dayjs().toISOString(),
      updatedAt: dayjs().toISOString(),
      favoritedBy: [],
      authorId: maybeUser.username,
    };

    try {
      const maybeArticle = databaseApi.article.create(mswArticle);
      const maybeProfile = databaseApi.profile.findFirst({
        where: { username: { equals: maybeUser.username } },
      });

      const articleDto = mapMswArticleDto(
        maybeArticle,
        maybeUser,
        maybeProfile,
      );

      return await res(ctx.status(200), ctx.json({ article: articleDto }));
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
  }),
];

export const setupPostCreateArticleHandlers = () => {
  server.use(...postCreateArticleHandlers);
};
