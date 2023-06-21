import { rest } from 'msw';
import { realworldApi } from '~shared/api/realworld';
import { server, initTestDatabase } from '~shared/lib/msw';

const databaseApi = initTestDatabase();

const getProfileByUsernameHandlers = [
  rest.get(`${realworldApi.baseUrl}/profiles/:username`, (req, res, ctx) => {
    const { username } = req.params;

    const maybeProfile = databaseApi.profile.findFirst({
      where: { username: { equals: String(username) } },
    });

    if (maybeProfile)
      return res(ctx.status(200), ctx.json({ profile: maybeProfile }));

    return res(
      ctx.status(404),
      ctx.json({ errors: { profile: ['not found'] } }),
    );
  }),
];

export const setupGetProfileByUsernameHandlers = () => {
  server.use(...getProfileByUsernameHandlers);
};
