import { isRouteErrorResponse } from 'react-router';

export function getErrorMessage(error: unknown, fallbackMessage: string) {
  if (isRouteErrorResponse(error)) {
    if (typeof error.data === 'string' && error.data.length > 0) {
      return error.data;
    }

    return `${error.status} ${error.statusText}`.trim();
  }

  if (error instanceof Error && error.message.length > 0) {
    return error.message;
  }

  return fallbackMessage;
}
