import { describe, expect, it, jest } from '@jest/globals';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter, useNavigate } from 'react-router-dom';
import { api } from '~shared/api/api.instance';
import { renderWithQueryClient } from '~shared/lib/test/test.lib';
import { DeleteArticleButton } from './delete-article.ui';

describe('DeleteArticleButton', () => {
  it('should render the delete button', () => {
    renderDeleteArticleButton();

    expect(screen.getByRole('button', { name: /delete article/i })).toBeInTheDocument();
  });

  it('should navigate to the home page on successful mutation', async () => {
    const navigate = jest.fn();
    // @ts-expect-error Property 'mockResolvedValue' does not exist
    useNavigate.mockReturnValue(navigate);
    // @ts-expect-error Property 'mockResolvedValue' does not exist
    api.delete.mockResolvedValue({});

    const { click } = renderDeleteArticleButton();

    await click(screen.getByRole('button', { name: /delete article/i }));

    await waitFor(() => {
      expect(navigate).toHaveBeenCalled();
    });
  });
});

function renderDeleteArticleButton() {
  const user = userEvent.setup();
  const renderResult = renderWithQueryClient(
    <BrowserRouter>
      <DeleteArticleButton slug="test-slug" />
    </BrowserRouter>,
  );

  return { ...user, ...renderResult };
}
