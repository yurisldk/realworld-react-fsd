import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi } from 'vitest';
import { FavoriteButton } from './FavoriteButton';

describe('<FavoriteButton />', () => {
  it('renders favorite button with default props', () => {
    render(<FavoriteButton />);

    const favoriteButton = screen.getByRole('button');

    expect(favoriteButton).toHaveClass('btn btn-sm');
    expect(favoriteButton).toHaveClass('btn-outline-primary');
    expect(favoriteButton).toHaveClass('pull-xs-none');
  });

  it('renders favorite button with custom props', () => {
    render(
      <FavoriteButton
        title="Custom Title"
        favorited
        float="right"
        onClick={() => {}}
      />,
    );

    const favoriteButton = screen.getByRole('button');

    expect(favoriteButton).toHaveTextContent(/custom title$/i);
    expect(favoriteButton).toHaveClass('btn btn-sm');
    expect(favoriteButton).not.toHaveClass('btn-outline-primary');
    expect(favoriteButton).toHaveClass('pull-xs-right');
  });

  it('calls onClick function when the button is clicked', async () => {
    const onClickMock = vi.fn();

    render(<FavoriteButton onClick={onClickMock} />);

    const button = screen.getByRole('button');

    await userEvent.click(button);

    expect(onClickMock).toBeCalledTimes(1);
  });
});
