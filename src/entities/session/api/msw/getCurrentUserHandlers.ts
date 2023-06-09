import { rest } from 'msw';
import { UserDto, realworldApi } from '~shared/api/realworld';
import { server } from '~shared/lib/msw';

const users: Record<string, UserDto> = {
  jwtToken: {
    email: 'jake@jake.jake',
    token: 'jwtToken',
    username: 'jake',
    bio: 'I work at statefarm',
    image: 'example.jpg',
  },
};

const getCurrentUserHandlers = [
  rest.get(`${realworldApi.baseUrl}/user`, (req, res, ctx) => {
    const authorization = req.headers.get('authorization');
    if (!authorization)
      return res(
        ctx.status(401),
        ctx.json({
          status: 'error',
          message: 'missing authorization credentials',
        }),
      );

    const token = authorization.startsWith('Token ');
    if (!token)
      return res(
        ctx.status(401),
        ctx.json({
          status: 'error',
          message: 'missing authorization credentials',
        }),
      );

    const user = users[authorization.split(' ')[1]];
    if (!user)
      return res(
        ctx.status(401),
        ctx.json({
          status: 'error',
          message: 'missing authorization credentials',
        }),
      );

    return res(ctx.status(200), ctx.json({ user }));
  }),
];

export const setupGetCurrentUserHandlers = () => {
  server.use(...getCurrentUserHandlers);
};
