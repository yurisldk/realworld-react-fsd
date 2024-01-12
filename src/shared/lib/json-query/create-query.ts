import { getErrorMessage } from '../error-handler';
import { QueryConfig } from './types';

export function createQuery<Params, Data, TransformedData>(
  config: QueryConfig<Params, Data, TransformedData>,
) {
  return async (params: Params) => {
    const { request: incomingRequest, response: incomingResponse } = config;

    const {
      url: incomingUrl,
      method,
      headers: incomingHeaders = { 'content-type': 'application/json' },
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

    responseUrl.search = new URLSearchParams(query).toString();

    const responseHeaders = new Headers();
    Object.keys(incomingHeaders).forEach((name) => {
      const value = incomingHeaders[name];
      responseHeaders.append(name, value);
    });

    const response = await fetch(responseUrl, {
      method,
      headers: responseHeaders,
      body: JSON.stringify(body),
    });

    try {
      const rawData = await response.json();
      if (!response.ok) {
        throw rawData as unknown;
      }

      const isData = contract.isData(rawData);

      if (!isData) {
        throw new Error(
          'Response was considered as invalid against a given contract',
        );
      }

      return mapData({ result: rawData, params });
    } catch (e) {
      throw new Error(getErrorMessage(e));
    }
  };
}
