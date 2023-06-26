import { rest } from 'msw';
import { realworldApi } from '~shared/api/realworld';
import {
  server,
  initTestDatabase,
  parseTokenFromRequest,
  mapMswProfileDto,
} from '~shared/lib/msw';

const databaseApi = initTestDatabase();

const deleteUnfollowUserHandlers = [
  rest.delete(
    `${realworldApi.baseUrl}/profiles/:username/follow`,
    async (req, res, ctx) => {
      const { username } = req.params;

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

      const maybeProfile = databaseApi.profile.findFirst({
        where: { username: { equals: String(username) } },
      });

      if (!maybeProfile)
        return res(
          ctx.status(404),
          ctx.json({ errors: { profile: ['not found'] } }),
        );

      try {
        const mswProfile = databaseApi.profile.update({
          where: { username: { equals: String(maybeProfile.username) } },
          data: {
            ...maybeProfile,
            followedBy: maybeProfile.followedBy.filter(
              (profile) => profile !== maybeUser.username,
            ),
          },
        });

        const profileDto = mapMswProfileDto(maybeUser, mswProfile);

        return await res(ctx.status(200), ctx.json({ profile: profileDto }));
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

export const setupDeleteUnfollowUserHandlers = () => {
  server.use(...deleteUnfollowUserHandlers);
};
