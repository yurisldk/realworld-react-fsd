import { describe, expect, it } from '@jest/globals';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import { api } from '~shared/api/api.instance';
import { renderWithQueryClient } from '~shared/lib/test/test.lib';
import { UnfollowUserButton } from './unfollow-profile.ui';

describe('UnfollowUserButton Component', () => {
  it('should display the button with the correct text', () => {
    renderUnfollowUserButton();

    expect(screen.getByRole('button', { name: /unfollow mockuser/i })).toBeInTheDocument();
  });

  it('should call the mutate function with the unfollowed profile when clicked', async () => {
    // @ts-expect-error Property 'mockResolvedValue' does not exist
    const mockRequest = api.delete.mockResolvedValue({});

    const { click } = renderUnfollowUserButton();

    await click(screen.getByRole('button', { name: /unfollow mockuser/i }));

    await waitFor(() => {
      expect(mockRequest).toHaveBeenCalled();
    });
  });
});

const username = 'mockuser';

function renderUnfollowUserButton() {
  const user = userEvent.setup();
  const renderResult = renderWithQueryClient(
    <BrowserRouter>
      <UnfollowUserButton username={username} />
    </BrowserRouter>,
  );

  return { ...user, ...renderResult };
}
