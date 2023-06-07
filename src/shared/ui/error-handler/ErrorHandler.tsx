/* eslint-disable no-case-declarations */
import { GenericErrorModel, GenericErrorModelDto } from '~shared/api/realworld';
import { ErrorMessage } from '../error-message';
import { ErrorsList } from '../errors-list';

type ErrorHandlerProps = {
  errorData: GenericErrorModel;
};

export function ErrorHandler(props: ErrorHandlerProps) {
  const { errorData } = props;

  switch (errorData.status) {
    case 422:
      const errors = errorData.error as GenericErrorModelDto;
      return <ErrorsList errors={errors.errors} />;

    default:
      const error = errorData.error as { message: string };
      return <ErrorMessage error={error} />;
  }
}
