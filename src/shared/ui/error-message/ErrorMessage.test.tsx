import { render, screen } from '@testing-library/react';
import { ErrorMessage } from './ErrorMessage';

describe('ErrorMessage', () => {
  it('renders error message correctly', () => {
    const error = { message: 'Something went wrong' };

    render(<ErrorMessage error={error} />);

    const errorMessage = screen.getByText('Something went wrong');
    expect(errorMessage).toBeInTheDocument();
  });

  it('does not render error message when error is empty', () => {
    const error = { message: '' };
    render(<ErrorMessage error={error} />);

    const errorMessage = screen.getByRole('listitem');
    expect(errorMessage).toBeEmptyDOMElement();
  });
});
