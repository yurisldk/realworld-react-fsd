import { rest } from 'msw';
import {
  server,
  initTestDatabase,
  parseTokenFromRequest,
} from '~shared/api/msw';
import { realworldApi } from '~shared/api/realworld';

const databaseApi = initTestDatabase();

const getCurrentUserHandlers = [
  rest.get(`${realworldApi.baseUrl}/user`, (req, res, ctx) => {
    const token = parseTokenFromRequest(req);

    if (!token)
      return res(
        ctx.status(401),
        ctx.json({
          status: 'error',
          message: 'missing authorization credentials',
        }),
      );

    const maybeUser = databaseApi.user.findFirst({
      where: { token: { equals: token } },
    });

    if (maybeUser) return res(ctx.status(200), ctx.json({ user: maybeUser }));

    return res(
      ctx.status(401),
      ctx.json({
        status: 'error',
        message: 'missing authorization credentials',
      }),
    );
  }),
];

export const setupGetCurrentUserHandlers = () => {
  server.use(...getCurrentUserHandlers);
};
