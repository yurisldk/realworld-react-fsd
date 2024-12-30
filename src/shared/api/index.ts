import axios, { AxiosError } from 'axios'
import { z } from 'zod'

export const realworld = axios.create({
  baseURL: 'http://localhost:3000/api',
})

export function handleGenericError(error: AxiosError) {
  /**
   * spec told that only 422 status code should return GenericError errors
   * but sometimes responses with other statuses returns
   * the same shape of error, this is a reason why we cant use this code
   * and have to validate each response
   * @see https://realworld-docs.netlify.app/docs/specs/frontend-specs/swagger
   */
  // if (error.response?.status !== 422) {
  //   return Promise.reject(error)
  // }

  const validation = GenericErrorSchema.safeParse(error.response?.data)

  if (validation.error) {
    return error
  }

  const message = formatValidationErrors(validation.data)

  return new AxiosError(
    message,
    error.code,
    error.config,
    error.request,
    error.response,
  )
}

const GenericErrorSchema = z.object({
  errors: z.record(z.string(), z.array(z.string())),
})

type GenericError = z.infer<typeof GenericErrorSchema>

function formatValidationErrors(data: GenericError): string {
  return Object.entries(data.errors)
    .map(([field, messages]) =>
      messages.map((message) => `${field}: ${message}`).join('\n'),
    )
    .join('\n')
}
