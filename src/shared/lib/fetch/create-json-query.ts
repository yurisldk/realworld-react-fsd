import { ZodType } from 'zod'
import { createValidationIssue } from '../error'
import { createApiRequest } from './create-api-request'
import { FetchApiRecord } from './fetch.types'

interface JsonQueryConfig {
  url: string
  method: 'HEAD' | 'GET'
  headers?: FetchApiRecord
  query?: FetchApiRecord
}

export async function createJsonQuery<
  Response,
  ContractData extends Response,
  MappedData,
>(config: {
  request: JsonQueryConfig
  response: {
    contract: ZodType<ContractData>
    mapData: (data: ContractData) => MappedData
  }
  abort?: AbortSignal
}): Promise<MappedData>

export async function createJsonQuery<
  Response,
  ContractData extends Response,
>(config: {
  request: JsonQueryConfig
  response: {
    contract: ZodType<ContractData>
  }
  abort?: AbortSignal
}): Promise<ContractData>

export async function createJsonQuery<
  Response,
  ContractData extends Response,
  MappedData,
>(config: {
  request: JsonQueryConfig
  response: {
    mapData: (data: ContractData) => MappedData
  }
  abort?: AbortSignal
}): Promise<MappedData>

export async function createJsonQuery(config: {
  request: JsonQueryConfig
  abort?: AbortSignal
}): Promise<unknown>

export async function createJsonQuery<
  Response,
  ContractData extends Response,
  MappedData,
>(config: {
  request: JsonQueryConfig
  response?: {
    contract?: ZodType<ContractData>
    mapData?: (data: ContractData) => MappedData
  }
  abort?: AbortSignal
}) {
  const data = await createApiRequest({
    request: config.request,
    abort: config.abort,
  })

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
