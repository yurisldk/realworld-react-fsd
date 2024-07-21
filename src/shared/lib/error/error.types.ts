import { z, ZodIssue } from 'zod'

export const IssueCode = {
  invalid_data: 'invalid_data',
  preparation: 'preparation',
  http: 'http',
  network: 'network',
  unexpected_error: 'unexpected_error',
  // invalid_type: 'invalid_type',
  // invalid_literal: 'invalid_literal',
  // custom: 'custom',
  // invalid_union: 'invalid_union',
  // invalid_union_discriminator: 'invalid_union_discriminator',
  // invalid_enum_value: 'invalid_enum_value',
  // unrecognized_keys: 'unrecognized_keys',
  // invalid_arguments: 'invalid_arguments',
  // invalid_return_type: 'invalid_return_type',
  // invalid_date: 'invalid_date',
  // invalid_string: 'invalid_string',
  // too_small: 'too_small',
  // too_big: 'too_big',
  // invalid_intersection_types: 'invalid_intersection_types',
  // not_multiple_of: 'not_multiple_of',
  // not_finite: 'not_finite',
} as const

export interface GenericIssue<T extends string> {
  code: T
  message: string
  cause: Error
  context?: unknown
}

export interface ValidationIssue
  extends GenericIssue<typeof IssueCode.invalid_data> {
  errors: ZodIssue[]
}

export interface PreparationIssue
  extends GenericIssue<typeof IssueCode.preparation> {}

export interface HttpIssue<Status extends number = number>
  extends GenericIssue<typeof IssueCode.http> {
  status: Status
  statusText: string
}

export interface NetworkIssue extends GenericIssue<typeof IssueCode.network> {}

export const UnexpectedErrorDtoSchema = z.object({
  errors: z.record(z.string(), z.string().array()),
})
export type UnexpectedErrorDto = z.infer<typeof UnexpectedErrorDtoSchema>
export interface UnexpectedIssue<Status extends number = number>
  extends GenericIssue<typeof IssueCode.unexpected_error> {
  status: Status
  statusText: string
  errors: UnexpectedErrorDto['errors']
}
