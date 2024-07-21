export type HttpMethod =
  | 'HEAD'
  | 'GET'
  | 'POST'
  | 'PUT'
  | 'PATCH'
  | 'DELETE'
  | 'QUERY'
  | 'OPTIONS'

export type RequestBody = Blob | BufferSource | FormData | string

export type FetchApiRecord = Record<
  string,
  string | string[] | number | boolean | null | undefined
>
