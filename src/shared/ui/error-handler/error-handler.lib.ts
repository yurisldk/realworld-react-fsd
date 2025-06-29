/* eslint-disable no-console */

export function logError(error: Error, info: { componentStack?: string | null }) {
  if (__NODE_ENV__ === 'development') {
    console.log('Caught error:', error);
    console.log('Error details:', info);
  } else {
    // Log error to an external service in production
  }
}
