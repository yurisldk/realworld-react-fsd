interface FieldError {
  message: string
}

export function hasMessages(errors: any): errors is Record<string, FieldError> {
  return Object.values(errors).some(
    (error) =>
      error !== undefined &&
      error !== null &&
      typeof error === 'object' &&
      'message' in error &&
      typeof error.message === 'string',
  )
}
