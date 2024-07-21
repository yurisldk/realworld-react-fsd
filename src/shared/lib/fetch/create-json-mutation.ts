import { ZodType } from 'zod'
import { createValidationIssue } from '../error'
import { createApiRequest } from './create-api-request'
import { FetchApiRecord, RequestBody } from './fetch.types'

interface JsonMutationConfig {
  url: string
  method: 'POST' | 'PUT' | 'PATCH' | 'DELETE'
  headers?: FetchApiRecord
  query?: FetchApiRecord
  body?: RequestBody
}

export async function createJsonMutation<
  Response,
  ContractData extends Response,
  MappedData,
>(config: {
  request: JsonMutationConfig
  response: {
    contract: ZodType<ContractData>
    mapData: (data: ContractData) => MappedData
  }
}): Promise<MappedData>

export async function createJsonMutation<
  Response,
  ContractData extends Response,
>(config: {
  request: JsonMutationConfig
  response: {
    contract: ZodType<ContractData>
  }
}): Promise<ContractData>

export async function createJsonMutation<
  Response,
  ContractData extends Response,
  MappedData,
>(config: {
  request: JsonMutationConfig
  response: {
    mapData: (data: ContractData) => MappedData
  }
}): Promise<MappedData>

export async function createJsonMutation(config: {
  request: JsonMutationConfig
}): Promise<unknown>

export async function createJsonMutation<
  Response,
  ContractData extends Response,
  MappedData,
>(config: {
  request: JsonMutationConfig
  response?: {
    contract?: ZodType<ContractData>
    mapData?: (data: ContractData) => MappedData
  }
}) {
  const data = await createApiRequest({ request: config.request })

  if (config?.response?.contract) {
    const validation = config.response.contract.safeParse(data)

    if (validation.error) {
      throw createValidationIssue({
        errors: validation.error.errors,
        context: data,
        cause: validation.error,
      })
    }

    return config?.response?.mapData
      ? config.response.mapData(validation.data)
      : validation.data
  }

  return config?.response?.mapData ? config.response.mapData(data) : data
}
