import { rest } from 'msw';
import {
  server,
  initTestDatabase,
  parseTokenFromRequest,
  mapMswArticleDto,
} from '~shared/api/msw';
import { realworldApi } from '~shared/api/realworld';

const databaseApi = initTestDatabase();

const getGlobalArticlesHandlers = [
  rest.get(`${realworldApi.baseUrl}/articles`, (req, res, ctx) => {
    const author = req.url.searchParams.get('author');
    const favorited = req.url.searchParams.get('favorited');
    const tag = req.url.searchParams.get('tag');
    const offset = Number(req.url.searchParams.get('offset'));
    const limit = Number(req.url.searchParams.get('limit'));

    /**
     * temporary
     * @see https://github.com/mswjs/data/issues/249
     * we have to use databaseApi.article.findMany({ where: {...} })
     */
    const articles = databaseApi.article
      .getAll()
      .filter((article) => (author ? article.authorId === author : true))
      .filter((article) =>
        favorited ? article.favoritedBy.includes(favorited) : true,
      )
      .filter((article) => (tag ? article.tagList.includes(tag) : true));

    const token = parseTokenFromRequest(req);
    const maybeUser = databaseApi.user.findFirst({
      where: { token: { equals: token } },
    });

    const articlesDto = articles
      .slice(offset, limit + offset)
      .map((article) => {
        const maybeProfile = databaseApi.profile.findFirst({
          where: { username: { equals: article.authorId } },
        });

        return mapMswArticleDto(article, maybeUser, maybeProfile);
      });

    return res(
      ctx.status(200),
      ctx.json({
        articles: articlesDto,
        articlesCount: articles.length,
      }),
    );
  }),
];

export const setupGetGlobalArticlesHandlers = () => {
  server.use(...getGlobalArticlesHandlers);
};
