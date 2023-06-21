import { rest } from 'msw';
import { realworldApi } from '~shared/api/realworld';
import { server, initTestDatabase } from '~shared/lib/msw';

const databaseApi = initTestDatabase();

const getTagsHandlersHandlers = [
  rest.get(`${realworldApi.baseUrl}/tags`, (_, res, ctx) => {
    const tags = databaseApi.tag.getAll().map((tag) => tag.name);

    return res(ctx.status(200), ctx.json({ tags }));
  }),
];

export const setupGetTagsHandlers = () => {
  server.use(...getTagsHandlersHandlers);
};
