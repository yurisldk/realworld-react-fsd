import { getErrorMessage } from '../error-handler';
import { QueryConfig } from './types';

export function createQuery<Params, Data, TransformedData>(
  config: QueryConfig<Params, Data, TransformedData>,
) {
  return async (params: Params, signal?: AbortSignal) => {
    const { request: incomingRequest, response: incomingResponse } = config;

    const {
      url: incomingUrl,
      method,
      headers: incomingHeaders = {},
      query: incomingQuery = {},
      body: incomingBody = undefined,
    } = incomingRequest;

    const { contract, mapData } = incomingResponse;

    const url =
      typeof incomingUrl === 'function' ? incomingUrl(params) : incomingUrl;

    const query =
      typeof incomingQuery === 'function'
        ? incomingQuery(params)
        : incomingQuery;

    const body =
      typeof incomingBody === 'function' ? incomingBody(params) : incomingBody;

    const responseUrl = new URL(url);
    const searchParams = new URLSearchParams();
    Object.keys(query).forEach((name) => {
      const value = query[name];
      if (value === undefined) return;
      searchParams.append(name, value + '');
    });

    responseUrl.search = searchParams.toString();

    const headers =
      typeof incomingHeaders === 'function'
        ? incomingHeaders(params)
        : incomingHeaders;

    const responseHeaders = new Headers();
    responseHeaders.append('content-type', 'application/json');
    Object.keys(headers).forEach((name) => {
      const value = headers[name];
      responseHeaders.append(name, value);
    });

    const response = await fetch(responseUrl, {
      method,
      headers: responseHeaders,
      body: JSON.stringify(body),
      signal,
    });

    try {
      // FIXME:
      const rawData = response.status === 204 ? {} : await response.json();
      if (!response.ok) {
        throw rawData as unknown;
      }

      const isData = contract.isData(rawData);

      if (!isData) {
        throw new Error(
          `Response was considered as invalid against a given contract \n ${contract.getErrorMessages(
            rawData,
          )}`,
        );
      }

      return mapData({ result: rawData, params });
    } catch (e) {
      throw new Error(getErrorMessage(e));
    }
  };
}
