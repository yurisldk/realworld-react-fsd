import { render, screen } from '@testing-library/react';
import { ErrorsList } from './ErrorsList';

describe('<ErrorsList />', () => {
  it('renders the error messages correctly', () => {
    const errors = {
      field1: ['error message 1', 'error message 2'],
      field2: ['error message 3'],
    };

    // @ts-expect-error Property 'body' is missing in type
    render(<ErrorsList errors={errors} />);

    expect(screen.getByText('That field1 error message 1')).toBeInTheDocument();
    expect(screen.getByText('That field1 error message 2')).toBeInTheDocument();
    expect(screen.getByText('That field2 error message 3')).toBeInTheDocument();
  });

  it('renders no error messages when the errors prop is empty', () => {
    const errors = {};

    // @ts-expect-error Property 'body' is missing in type
    render(<ErrorsList errors={errors} />);

    expect(screen.queryByText(/That$/i)).not.toBeInTheDocument();
  });

  it('renders multiple error messages for the same field correctly', () => {
    const errors = {
      field1: ['Error message 1', 'Error message 2'],
    };

    // @ts-expect-error Property 'body' is missing in type
    render(<ErrorsList errors={errors} />);

    expect(screen.getByText('That field1 Error message 1')).toBeInTheDocument();
    expect(screen.getByText('That field1 Error message 2')).toBeInTheDocument();
  });
});
