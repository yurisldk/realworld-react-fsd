import {
  InvalidDataError,
  INVALID_DATA,
  PreparationError,
  PREPARATION,
  Json,
  HttpError,
  HTTP,
  NetworkError,
  NETWORK,
} from './fetch.types';

export function invalidDataError(config: {
  validationErrors: string[];
  response: unknown;
}): InvalidDataError {
  return {
    ...config,
    errorType: INVALID_DATA,
    explanation: 'Response was considered as invalid against a given contract',
  };
}

export function preparationError(config: {
  response: string;
  reason: string | null;
}): PreparationError {
  return {
    ...config,
    errorType: PREPARATION,
    explanation: 'Extraction of data from the response was failed',
  };
}

export function httpError(config: {
  status: number;
  statusText: string;
  response: string | Json | null;
}): HttpError {
  return {
    ...config,
    errorType: HTTP,
    explanation: 'Request was finished with unsuccessful HTTP code',
  };
}

export function networkError(config: {
  reason: string | null;
  cause?: unknown;
}): NetworkError {
  return {
    ...config,
    errorType: NETWORK,
    explanation: 'Request was failed due to network problems',
  };
}
