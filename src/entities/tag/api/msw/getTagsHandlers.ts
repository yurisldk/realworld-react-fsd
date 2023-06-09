import { rest } from 'msw';
import { realworldApi } from '~shared/api/realworld';
import { server } from '~shared/lib/msw';

const tagsList: Record<string, string[]> = {
  popular: ['reactjs', 'angularjs'],
};

const getTagsHandlersHandlers = [
  rest.get(`${realworldApi.baseUrl}/tags`, (_, res, ctx) => {
    const tags = tagsList.popular;

    return res(ctx.status(200), ctx.json({ tags }));
  }),
];

export const setupGetTagsHandlers = () => {
  server.use(...getTagsHandlersHandlers);
};
