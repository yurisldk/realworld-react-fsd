import { INVALID_DATA, InvalidDataError } from './error-handler.types';

export function invalidDataError(config: {
  validationErrors: string[];
}): InvalidDataError {
  return {
    ...config,
    errorType: INVALID_DATA,
    message: 'Operation was considered as invalid against a given contract',
  };
}
