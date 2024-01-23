import {
  GenericError,
  InvalidDataError,
  INVALID_DATA,
  PreparationError,
  PREPARATION,
  HttpError,
  HTTP,
  NetworkError,
  NETWORK,
} from './fetch.types';

export function isInvalidDataError(
  error: GenericError<any>,
): error is InvalidDataError {
  return error?.errorType === INVALID_DATA;
}

export function isPreparationError(
  error: GenericError<any>,
): error is PreparationError {
  return error?.errorType === PREPARATION;
}

export function isHttpError(error: GenericError<any>): error is HttpError {
  return error?.errorType === HTTP;
}

export function isHttpErrorCode<Code extends number>(code: Code | Code[]) {
  return function isExactHttpError(
    error: GenericError<any>,
  ): error is HttpError<Code> {
    if (!isHttpError(error)) {
      return false;
    }

    const codes = Array.isArray(code) ? code : [code];

    return codes.includes(error.status as any);
  };
}

export function isNetworkError(
  error: GenericError<any>,
): error is NetworkError {
  return error?.errorType === NETWORK;
}
