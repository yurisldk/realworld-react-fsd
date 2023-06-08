import { render, screen } from '@testing-library/react';
import { ErrorHandler } from './ErrorHandler';

describe('ErrorHandler', () => {
  it('should render ErrorsList when error status is 422', () => {
    const errorData = {
      status: 422,
      error: {
        errors: {
          field1: ['error message 1', 'error message 2'],
          field2: ['error message 3'],
        },
      },
    };

    // @ts-expect-error Property 'body' is missing in type
    render(<ErrorHandler errorData={errorData} />);
    const errorsListElement = screen.getByRole('list');

    expect(errorsListElement).toBeInTheDocument();
  });

  it('should render ErrorMessage when error status is not 422', () => {
    const errorData = {
      status: 500,
      error: {
        message: 'Internal server error',
      },
    };

    // @ts-expect-error Property 'body' is missing in type
    render(<ErrorHandler errorData={errorData} />);
    const errorMessageElement = screen.getByRole('list');

    expect(errorMessageElement).toBeInTheDocument();
  });
});
