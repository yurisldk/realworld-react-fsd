import { rest } from 'msw';
import {
  server,
  initTestDatabase,
  parseTokenFromRequest,
  mapMswProfileDto,
} from '~shared/api/msw';
import { realworldApi } from '~shared/api/realworld';

const databaseApi = initTestDatabase();

const getProfileByUsernameHandlers = [
  rest.get(`${realworldApi.baseUrl}/profiles/:username`, (req, res, ctx) => {
    const { username } = req.params;

    const token = parseTokenFromRequest(req);
    const maybeUser = databaseApi.user.findFirst({
      where: { token: { equals: token } },
    });

    const maybeProfile = databaseApi.profile.findFirst({
      where: { username: { equals: String(username) } },
    });

    if (!maybeProfile)
      return res(
        ctx.status(404),
        ctx.json({ errors: { profile: ['not found'] } }),
      );

    const profileDto = mapMswProfileDto(maybeUser, maybeProfile);

    return res(ctx.status(200), ctx.json({ profile: profileDto }));
  }),
];

export const setupGetProfileByUsernameHandlers = () => {
  server.use(...getProfileByUsernameHandlers);
};
