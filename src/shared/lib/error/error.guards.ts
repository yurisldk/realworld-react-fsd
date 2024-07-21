import {
  GenericIssue,
  HttpIssue,
  IssueCode,
  NetworkIssue,
  PreparationIssue,
  ValidationIssue,
} from './error.types'

export function isGenericIssue(
  issue: GenericIssue<any>,
): issue is GenericIssue<any> {
  return Boolean(issue?.code)
}

export function isValidationIssue(
  issue: GenericIssue<any>,
): issue is ValidationIssue {
  return issue?.code === IssueCode.invalid_data
}

export function isPreparationIssue(
  error: GenericIssue<any>,
): error is PreparationIssue {
  return error?.code === IssueCode.preparation
}

export function iscreateHttpIssue(
  issue: GenericIssue<any>,
): issue is HttpIssue {
  return issue?.code === IssueCode.http
}

export function iscreateHttpIssueCode<Code extends number>(
  code: Code | Code[],
) {
  return function isExactcreateHttpIssue(
    issue: GenericIssue<any>,
  ): issue is HttpIssue<Code> {
    if (!iscreateHttpIssue(issue)) {
      return false
    }

    const codes = Array.isArray(code) ? code : [code]

    return codes.includes(issue.status as any)
  }
}

export function isNetworkIssue(
  issue: GenericIssue<any>,
): issue is NetworkIssue {
  return issue?.code === IssueCode.network
}
