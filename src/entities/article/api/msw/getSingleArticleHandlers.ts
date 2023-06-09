import { rest } from 'msw';
import { ArticleDto, realworldApi } from '~shared/api/realworld';
import { server } from '~shared/lib/msw';

const articles: Record<string, ArticleDto> = {
  'how-to-train-your-dragon': {
    slug: 'how-to-train-your-dragon',
    title: 'How to train your dragon',
    description: 'Ever wonder how?',
    body: 'It takes a Jacobian',
    tagList: ['dragons', 'training'],
    createdAt: '2016-02-18T03:22:56.637Z',
    updatedAt: '2016-02-18T03:48:35.824Z',
    favorited: false,
    favoritesCount: 0,
    author: {
      username: 'jake',
      bio: 'I work at statefarm',
      image: 'https://i.stack.imgur.com/xHWG8.jpg',
      following: false,
    },
  },
};

const getSingleArticleHandlers = [
  rest.get(`${realworldApi.baseUrl}/articles/:slug`, (req, res, ctx) => {
    const { slug } = req.params;

    const article = articles[slug as string];

    if (!article)
      return res(
        ctx.status(404),
        ctx.json({ errors: { article: ['not found'] } }),
      );

    return res(ctx.status(200), ctx.json({ article }));
  }),
];

export const setupGetSingleArticleHandlers = () => {
  server.use(...getSingleArticleHandlers);
};
