import { ZodIssue } from 'zod'
import { iscreateHttpIssue } from './error.guards'
import {
  GenericIssue,
  HttpIssue,
  IssueCode,
  NetworkIssue,
  PreparationIssue,
  UnexpectedErrorDtoSchema,
  UnexpectedIssue,
  ValidationIssue,
} from './error.types'

export function createValidationIssue(config: {
  errors: ZodIssue[]
  cause: Error
  context?: unknown
}): ValidationIssue {
  return {
    ...config,
    code: IssueCode.invalid_data,
    message: 'The provided data does not meet the required criteria.',
  }
}

export class GenericError extends Error {
  constructor(message?: string, options?: ErrorOptions) {
    super(message, options)
    this.name = 'GenericError'
  }
}

export class ValidationError extends GenericError {
  constructor() {
    super('The provided data does not meet the required criteria.')
    this.name = 'ValidationError'
  }
}

export function createPreparationIssue(config: {
  cause: Error
  context?: unknown
}): PreparationIssue {
  return {
    ...config,
    code: IssueCode.preparation,
    message: 'Extraction of data from the response failed.',
  }
}

export class PreparationError extends GenericError {
  constructor() {
    super('Extraction of data from the response failed.')
    this.name = 'PreparationError'
  }
}

export function createHttpIssue(config: {
  status: number
  statusText: string
  cause: Error
  context?: unknown
}): HttpIssue {
  return {
    ...config,
    code: IssueCode.http,
    message: 'Request finished with an unsuccessful HTTP code.',
  }
}

export class HttpError extends GenericError {
  constructor() {
    super('Request finished with an unsuccessful HTTP code.')
    this.name = 'HttpError'
  }
}

export function createNetworkIssue(config: {
  cause: Error
  context?: unknown
}): NetworkIssue {
  return {
    ...config,
    code: IssueCode.network,
    message: 'An unexpected network error occurred.',
  }
}

export class NetworkError extends GenericError {
  constructor() {
    super('An unexpected network error occurred.')
    this.name = 'NetworkError'
  }
}

export function handleMutationIssue(
  issue: GenericIssue<any>,
): GenericIssue<any> {
  if (!iscreateHttpIssue(issue) || !issue.context) return issue

  const jsonResponse = safeJsonParse(issue.context)
  const validation = UnexpectedErrorDtoSchema.safeParse(jsonResponse)

  if (!validation.success) return issue

  return {
    ...issue,
    code: IssueCode.unexpected_error,
    errors: validation.data.errors,
    message: formatValidationErrors(validation.data.errors),
  } as UnexpectedIssue
}

export class UnexpectedError extends GenericError {
  constructor() {
    super('An unexpected error occurred.')
    this.name = 'UnexpectedError'
  }
}

function safeJsonParse(jsonString: any): Record<string, unknown> {
  try {
    return JSON.parse(jsonString)
  } catch {
    return {}
  }
}

function formatValidationErrors(errors: Record<string, string[]>): string {
  return Object.entries(errors)
    .map(([field, messages]) =>
      messages.map((message) => `${field}: ${message}`).join('\n'),
    )
    .join('\n')
}
