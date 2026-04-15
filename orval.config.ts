// eslint-disable-next-line import/no-extraneous-dependencies
import { defineConfig } from 'orval';

export default defineConfig({
  fetch: {
    input: {
      target: './openapi.yaml',
    },
    output: {
      clean: true,
      prettier: true,
      biome: true,
      mode: 'tags-split',
      client: 'react-query',
      httpClient: 'fetch',
      workspace: './src/shared/api',
      target: './generated/fetch',
      baseUrl: 'http://localhost:3000/api',
      indexFiles: false,
      schemas: {
        path: './generated/schemas',
        type: 'zod',
      },
      mock: {
        type: 'msw',
        delay: 1000,
      },
      override: {
        mutator: {
          path: './auth-fetch.ts',
          name: 'apiFetch',
        },
        mock: {
          arrayMin: 1,
          arrayMax: 10,
          stringMin: 1,
          stringMax: 20,
          numberMin: 1,
          numberMax: 100,
        },
        fetch: {
          runtimeValidation: true,
          includeHttpResponseReturnType: true,
          forceSuccessResponse: true,
        },
        query: {
          useInfinite: false,
          useMutation: false,
          useQuery: true,
          useSuspenseQuery: false,
          useSuspenseInfiniteQuery: false,
          signal: true,
        },
        zod: {
          generate: {
            body: true,
            query: true,
            param: true,
            header: true,
            response: true,
          },
          coerce: {
            query: true,
            param: true,
          },
        },
      },
    },
  },
});
