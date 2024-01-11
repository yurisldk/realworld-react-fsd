import { render, screen } from '@testing-library/react';
import { vi } from 'vitest';
import { ErrorHandler } from './ErrorHandler';

describe('ErrorHandler', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should render UnexpectedError successfully', () => {
    const error = {
      error: {
        errors: {
          field1: ['error message 1', 'error message 2'],
          field2: ['error message 3'],
        },
      },
    };

    // @ts-expect-error Property 'body' is missing in type
    render(<ErrorHandler error={error} />);
    const errorsListElement = screen.getByRole('list');

    expect(errorsListElement).toBeDefined();
  });

  it('should render GenericErrorModelDto successfully', () => {
    const error = { error: { message: 'Internal server error' } };

    // @ts-expect-error Property 'body' is missing in type
    render(<ErrorHandler error={error} />);
    const errorMessageElement = screen.getByRole('list');

    expect(errorMessageElement).toBeDefined();
  });

  it('should throw `Unexpected error type` error', () => {
    vi.spyOn(console, 'error').mockImplementation(() => {});

    const error = { error: 'error' };

    // @ts-expect-error Property 'body' is missing in type
    expect(() => render(<ErrorHandler error={error} />)).toThrow(
      'Unexpected error type',
    );
  });

  it('should propagate error', () => {
    vi.spyOn(console, 'error').mockImplementation(() => {});

    const error = new Error('error message');

    // @ts-expect-error Property 'body' is missing in type
    expect(() => render(<ErrorHandler error={error} />)).toThrow(
      'error message',
    );
  });
});
