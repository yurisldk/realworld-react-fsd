export type GenericError<T extends string> = {
  errorType: T;
  message: string;
};

export const INVALID_DATA = 'INVALID_DATA';
export interface InvalidDataError extends GenericError<typeof INVALID_DATA> {
  validationErrors: string[];
}
