import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi } from 'vitest';
import { FollowButton } from './FollowButton';

describe('<FollowButton />', () => {
  it('renders follow button with default props', () => {
    render(<FollowButton />);

    const followButton = screen.getByRole('button');
    expect(followButton).toHaveClass('btn btn-sm action-btn');
    expect(followButton).toHaveClass('btn-outline-secondary');

    const icon = screen.getByTestId('icon');
    expect(icon).toHaveClass('ion-plus-round');
  });

  it('renders follow button with custom props', () => {
    render(<FollowButton title="Custom Title" following onClick={() => {}} />);

    const followButton = screen.getByRole('button');
    expect(followButton).toHaveTextContent(/custom title$/i);
    expect(followButton).toHaveClass('btn btn-sm action-btn');
    expect(followButton).not.toHaveClass('btn-outline-secondary');
    expect(followButton).toHaveClass('btn-secondary');

    const icon = screen.getByTestId('icon');
    expect(icon).toHaveClass('ion-minus-round');
  });

  it('calls onClick function when the button is clicked', async () => {
    const onClickMock = vi.fn();

    render(<FollowButton onClick={onClickMock} />);

    const button = screen.getByRole('button');

    await userEvent.click(button);

    expect(onClickMock).toBeCalledTimes(1);
  });
});
