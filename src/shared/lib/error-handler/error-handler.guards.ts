import {
  GenericError,
  INVALID_DATA,
  InvalidDataError,
} from './error-handler.types';

export function isInvalidDataError(
  error: GenericError<any>,
): error is InvalidDataError {
  return error.errorType === INVALID_DATA;
}
