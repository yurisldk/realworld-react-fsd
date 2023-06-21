import { rest } from 'msw';
import { ArticleDto, ProfileDto, realworldApi } from '~shared/api/realworld';
import { server, initTestDatabase } from '~shared/lib/msw';

const databaseApi = initTestDatabase();

const getSingleArticleHandlers = [
  rest.get(`${realworldApi.baseUrl}/articles/:slug`, (req, res, ctx) => {
    const { slug } = req.params;

    const maybeArticle = databaseApi.article.findFirst({
      where: { slug: { equals: String(slug) } },
    });

    if (!maybeArticle)
      return res(
        ctx.status(404),
        ctx.json({ errors: { article: ['not found'] } }),
      );

    // TODO: map, add secure handler
    const article: ArticleDto = {
      ...maybeArticle,
      tagList: maybeArticle.tagList?.map((tag) => tag.name) || [],
      favorited: false,
      author: {
        ...maybeArticle.author,
        following: false,
      } as ProfileDto,
    };

    return res(ctx.status(200), ctx.json({ article }));
  }),
];

export const setupGetSingleArticleHandlers = () => {
  server.use(...getSingleArticleHandlers);
};
