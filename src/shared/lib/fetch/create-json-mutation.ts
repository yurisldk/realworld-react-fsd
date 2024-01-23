import { Contract } from '../zod';
import { createApiRequest } from './create-api-request';
import { invalidDataError } from './fetch.errors';
import { FetchApiRecord, RequestBody } from './fetch.types';

interface JsonMutationConfig {
  url: string;
  method: 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  headers?: FetchApiRecord;
  query?: FetchApiRecord;
  body?: RequestBody;
}

export async function createJsonMutation<
  Response,
  ContractData extends Response,
  MappedData,
>(config: {
  request: JsonMutationConfig;
  response: {
    contract: Contract<Response, ContractData>;
    mapData: (data: ContractData) => MappedData;
  };
}): Promise<MappedData>;

export async function createJsonMutation<
  Response,
  ContractData extends Response,
>(config: {
  request: JsonMutationConfig;
  response: {
    contract: Contract<Response, ContractData>;
  };
}): Promise<ContractData>;

export async function createJsonMutation<
  Response,
  ContractData extends Response,
  MappedData,
>(config: {
  request: JsonMutationConfig;
  response: {
    mapData: (data: ContractData) => MappedData;
  };
}): Promise<MappedData>;

export async function createJsonMutation(config: {
  request: JsonMutationConfig;
}): Promise<unknown>;

export async function createJsonMutation<
  Response,
  ContractData extends Response,
  MappedData,
>(config: {
  request: JsonMutationConfig;
  response?: {
    contract?: Contract<Response, ContractData>;
    mapData?: (data: ContractData) => MappedData;
  };
}) {
  const data = await createApiRequest({ request: config.request });

  if (config?.response?.contract && !config.response.contract.isData(data)) {
    throw invalidDataError({
      validationErrors: config.response.contract.getErrorMessages(data),
      response: data,
    });
  }

  return config?.response?.mapData ? config.response.mapData(data) : data;
}
