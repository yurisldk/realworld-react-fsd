import {
  HttpError,
  createHttpIssue,
  createNetworkIssue,
  createPreparationIssue,
} from '../error'
import { formatUrl, formatHeaders } from './fetch.lib'
import { HttpMethod, RequestBody, FetchApiRecord } from './fetch.types'

interface ApiRequest {
  method: HttpMethod
  body?: RequestBody
  headers?: FetchApiRecord
  query?: FetchApiRecord
  url: string
}

interface ApiConfig {
  request: ApiRequest
  abort?: AbortSignal
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
    throw createNetworkIssue({ cause: error })
  })

  if (!response.ok) {
    throw createHttpIssue({
      status: response.status,
      statusText: response.statusText,
      cause: new HttpError(),
      context: (await response.text().catch(() => null)) ?? null,
    })
  }

  if (response.status === 204) {
    return null
  }

  const clonedResponse = response.clone()

  const data = !response.body
    ? null
    : await response.json().catch(async (error) => {
        throw createPreparationIssue({
          context: await clonedResponse.text(),
          cause: error,
        })
      })

  return data
}
