import { describe, expect, it } from '@jest/globals';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import { api } from '~shared/api/api.instance';
import { renderWithQueryClient } from '~shared/lib/test/test.lib';
import { FollowUserButton } from './follow-profile.ui';

describe('FollowUserButton Component', () => {
  it('should display the button with the correct text', () => {
    renderFollowUserButton();

    expect(screen.getByRole('button', { name: /follow mockuser/i })).toBeInTheDocument();
  });

  it('should call the mutate function with the followed profile when clicked', async () => {
    // @ts-expect-error Property 'mockResolvedValue' does not exist
    const mockRequest = api.post.mockResolvedValue({});

    const { click } = renderFollowUserButton();

    await click(screen.getByRole('button', { name: /follow mockuser/i }));

    await waitFor(() => {
      expect(mockRequest).toHaveBeenCalled();
    });
  });
});

const username = 'mockuser';

function renderFollowUserButton() {
  const user = userEvent.setup();
  const renderResult = renderWithQueryClient(
    <BrowserRouter>
      <FollowUserButton username={username} />
    </BrowserRouter>,
  );

  return { ...user, ...renderResult };
}
