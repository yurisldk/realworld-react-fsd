import { rest } from 'msw';
import { CommentDto, realworldApi } from '~shared/api/realworld';
import { server } from '~shared/lib/msw';

const articlesComments: Record<string, CommentDto[]> = {
  'how-to-train-your-dragon': [
    {
      id: 1,
      createdAt: '2016-02-18T03:22:56.637Z',
      updatedAt: '2016-02-18T03:22:56.637Z',
      body: 'It takes a Jacobian',
      author: {
        username: 'jake',
        bio: 'I work at statefarm',
        image: 'https://i.stack.imgur.com/xHWG8.jpg',
        following: false,
      },
    },
  ],
};

const getArticlesCommentsHandlers = [
  rest.get(
    `${realworldApi.baseUrl}/articles/:slug/comments`,
    (req, res, ctx) => {
      const { slug } = req.params;

      const comments = articlesComments[slug as string];

      if (!comments)
        return res(
          ctx.status(404),
          ctx.json({ errors: { comments: ['not found'] } }),
        );

      return res(ctx.status(200), ctx.json({ comments }));
    },
  ),
];

export const setupGetArticlesCommentsHandlers = () => {
  server.use(...getArticlesCommentsHandlers);
};
