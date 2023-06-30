/* eslint-disable no-case-declarations */
import {
  GenericErrorModel,
  GenericErrorModelDto,
  UnexpectedErrorModelDto,
} from '~shared/api/realworld';

type ErrorHandlerProps = {
  error: GenericErrorModel;
};

export function ErrorHandler(props: ErrorHandlerProps) {
  const { error } = props;

  if (!error?.error) throw error as unknown;

  let errorList: string[] = [];

  switch (true) {
    case Object.hasOwn(error.error, 'errors'):
      const unexpectedError = error.error as UnexpectedErrorModelDto;
      errorList = Object.entries(unexpectedError.errors).flatMap(
        ([key, value]) => value.map((curError) => `${key} ${curError}`),
      );
      break;

    case Object.hasOwn(error.error, 'message'):
      const genericError = error.error as GenericErrorModelDto;
      errorList = [genericError.message];
      break;

    default:
      throw new Error('Unexpected error type');
  }

  return (
    <ul className="error-messages">
      {errorList.map((errorItem) => (
        <li key={errorItem}>{errorItem}</li>
      ))}
    </ul>
  );
}
