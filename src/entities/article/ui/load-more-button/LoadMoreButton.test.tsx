import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi } from 'vitest';
import { LoadMoreButton } from './LoadMoreButton';

describe('LoadMoreButton', () => {
  it('renders load more button with default props', () => {
    const onClickMock = vi.fn();

    render(<LoadMoreButton isFetchingNextPage={false} onClick={onClickMock} />);

    const loadMoreButton = screen.getByRole('button');

    expect(loadMoreButton).toBeDisabled();
    expect(loadMoreButton).toHaveTextContent(/load more$/i);
    expect(onClickMock).not.toBeCalled();
  });

  it('renders load more button with hasNextPage=true and isFetchingNextPage=false', async () => {
    const onClickMock = vi.fn();
    render(
      <LoadMoreButton
        hasNextPage
        isFetchingNextPage={false}
        onClick={onClickMock}
      />,
    );

    const loadMoreButton = screen.getByRole('button');

    expect(loadMoreButton).toBeEnabled();
    expect(loadMoreButton).toHaveTextContent(/load more$/i);

    await userEvent.click(loadMoreButton);

    expect(onClickMock).toBeCalledTimes(1);
  });

  it('renders load more button with hasNextPage=false', async () => {
    const onClickMock = vi.fn();

    render(
      <LoadMoreButton
        hasNextPage={false}
        isFetchingNextPage={false}
        onClick={onClickMock}
      />,
    );
    const loadMoreButton = screen.getByRole('button');

    expect(loadMoreButton).toBeDisabled();
    expect(loadMoreButton).toHaveTextContent(/load more$/i);

    await userEvent.click(loadMoreButton);
    expect(onClickMock).not.toBeCalled();
  });

  it('renders load more button with isFetchingNextPage=true', async () => {
    const onClickMock = vi.fn();

    render(
      <LoadMoreButton hasNextPage isFetchingNextPage onClick={onClickMock} />,
    );
    const loadMoreButton = screen.getByRole('button');

    expect(loadMoreButton).toBeDisabled();
    expect(loadMoreButton).toHaveTextContent(/loading more...$/i);

    await userEvent.click(loadMoreButton);
    expect(onClickMock).not.toBeCalled();
  });
});
