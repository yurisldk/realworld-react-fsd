import { afterAll, describe, expect, it, jest } from '@jest/globals';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter, useNavigate } from 'react-router-dom';
import { renderWithQueryClient } from '~shared/lib/test/test.lib';
import LogoutButton from './logout.ui';

describe('LogoutButton', () => {
  afterAll(() => {
    jest.resetAllMocks();
  });

  it('should navigate to home on successful logout', async () => {
    const navigate = jest.fn();
    // @ts-expect-error Property 'mockResolvedValue' does not exist
    useNavigate.mockReturnValue(navigate);

    const { click } = renderLogoutButton();

    await click(screen.getByRole('button', { name: /click here to logout/i }));

    await waitFor(() => {
      expect(navigate).toHaveBeenCalled();
    });
  });
});

function renderLogoutButton() {
  const user = userEvent.setup();
  const renderResult = renderWithQueryClient(
    <BrowserRouter>
      <LogoutButton />
    </BrowserRouter>,
  );

  return { ...user, ...renderResult };
}
