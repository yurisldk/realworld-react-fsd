import { httpError, networkError, preparationError } from './fetch.errors';
import { formatUrl, formatHeaders } from './fetch.lib';
import { HttpMethod, RequestBody, FetchApiRecord } from './fetch.types';

interface ApiRequest {
  method: HttpMethod;
  body?: RequestBody;
  headers?: FetchApiRecord;
  query?: FetchApiRecord;
  url: string;
}

interface ApiConfig {
  request: ApiRequest;
  abort?: AbortSignal;
}

export async function createApiRequest(config: ApiConfig) {
  const response = await fetch(
    formatUrl({ href: config.request.url, query: config.request.query || {} }),
    {
      method: config.request.method,
      headers: formatHeaders(config.request.headers || {}),
      body: config.request.body,
      signal: config?.abort,
    },
  ).catch((error) => {
    throw networkError({
      reason: error?.message ?? null,
      cause: error,
    });
  });

  if (!response.ok) {
    throw httpError({
      status: response.status,
      statusText: response.statusText,
      response: (await response.text().catch(() => null)) ?? null,
    });
  }

  const clonedResponse = response.clone();

  const data = !response.body
    ? null
    : await response.json().catch(async (error) => {
        throw preparationError({
          response: await clonedResponse.text(),
          reason: error?.message ?? null,
        });
      });

  return data;
}
