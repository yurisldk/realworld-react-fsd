import { getAuthHeader } from './auth-storage';

export interface ApiTransportError<Info = unknown> extends Error {
  status?: number;
  info?: Info;
  headers?: Headers;
}

function mergeHeaders(headers?: HeadersInit) {
  const mergedHeaders = new Headers(headers);
  const authHeader = getAuthHeader();

  if (!authHeader) {
    return mergedHeaders;
  }

  mergedHeaders.set('Authorization', authHeader);
  return mergedHeaders;
}

function isBodylessResponse(status: number) {
  return [204, 205, 304].includes(status);
}

function isJsonResponse(headers: Headers) {
  return headers.get('content-type')?.includes('application/json') ?? false;
}

async function parseResponseBody(response: Response) {
  if (isBodylessResponse(response.status)) {
    return null;
  }

  const text = await response.text();

  if (!text) {
    return null;
  }

  if (!isJsonResponse(response.headers)) {
    return text;
  }

  try {
    return JSON.parse(text);
  } catch {
    return text;
  }
}

function createTransportError(response: Response, info: unknown): ApiTransportError {
  const error = new Error('Request failed') as ApiTransportError;

  error.status = response.status;
  error.info = info ?? {};
  error.headers = response.headers;

  return error;
}

export async function apiFetch<T>(url: string, options: RequestInit = {}) {
  const requestUrl = new URL(url, __API_URL__);
  const apiUrl = new URL(__API_URL__);

  requestUrl.protocol = apiUrl.protocol;
  requestUrl.host = apiUrl.host;

  const response = await fetch(requestUrl.toString(), {
    ...options,
    headers: mergeHeaders(options.headers),
  });

  const data = await parseResponseBody(response);

  if (!response.ok) {
    throw createTransportError(response, data);
  }

  return {
    data,
    status: response.status,
    headers: response.headers,
  } as T;
}
