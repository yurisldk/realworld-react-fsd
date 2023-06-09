import { rest } from 'msw';
import { ProfileDto, realworldApi } from '~shared/api/realworld';
import { server } from '~shared/lib/msw';

const profiles: Record<string, ProfileDto> = {
  jake: {
    username: 'jake',
    bio: 'I work at statefarm',
    image: 'https://api.realworld.io/images/smiley-cyrus.jpg',
    following: false,
  },
};

const getProfileByUsernameHandlers = [
  rest.get(`${realworldApi.baseUrl}/profiles/:username`, (req, res, ctx) => {
    const { username } = req.params;

    const profile = profiles[username as string];

    if (!profile)
      return res(
        ctx.status(404),
        ctx.json({ errors: { profile: ['not found'] } }),
      );

    return res(ctx.status(200), ctx.json({ profile }));
  }),
];

export const setupGetProfileByUsernameHandlers = () => {
  server.use(...getProfileByUsernameHandlers);
};
