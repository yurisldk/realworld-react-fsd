import { Contract } from '../zod';
import { createApiRequest } from './create-api-request';
import { invalidDataError } from './fetch.errors';
import { FetchApiRecord } from './fetch.types';

interface JsonQueryConfig {
  url: string;
  method: 'HEAD' | 'GET';
  headers?: FetchApiRecord;
  query?: FetchApiRecord;
}

export async function createJsonQuery<
  Response,
  ContractData extends Response,
  MappedData,
>(config: {
  request: JsonQueryConfig;
  response: {
    contract: Contract<Response, ContractData>;
    mapData: (data: ContractData) => MappedData;
  };
  abort?: AbortSignal;
}): Promise<MappedData>;

export async function createJsonQuery<
  Response,
  ContractData extends Response,
>(config: {
  request: JsonQueryConfig;
  response: {
    contract: Contract<Response, ContractData>;
  };
  abort?: AbortSignal;
}): Promise<ContractData>;

export async function createJsonQuery<
  Response,
  ContractData extends Response,
  MappedData,
>(config: {
  request: JsonQueryConfig;
  response: {
    mapData: (data: ContractData) => MappedData;
  };
  abort?: AbortSignal;
}): Promise<MappedData>;

export async function createJsonQuery(config: {
  request: JsonQueryConfig;
  abort?: AbortSignal;
}): Promise<unknown>;

export async function createJsonQuery<
  Response,
  ContractData extends Response,
  MappedData,
>(config: {
  request: JsonQueryConfig;
  response?: {
    contract?: Contract<Response, ContractData>;
    mapData?: (data: ContractData) => MappedData;
  };
  abort?: AbortSignal;
}) {
  const data = await createApiRequest({
    request: config.request,
    abort: config.abort,
  });

  if (config?.response?.contract && !config.response.contract.isData(data)) {
    throw invalidDataError({
      validationErrors: config.response.contract.getErrorMessages(data),
      response: data,
    });
  }

  return config?.response?.mapData ? config.response.mapData(data) : data;
}
