import { describe, expect, it } from '@jest/globals';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import { api } from '~shared/api/api.instance';
import { renderWithQueryClient } from '~shared/lib/test/test.lib';
import { DeleteCommentButtton } from './delete-comment.ui';

describe('Delete Comment Button', () => {
  it('should display the delete icon', () => {
    renderDeleteCommentButtton();

    expect(screen.getByRole('button')).toBeInTheDocument();
  });

  it('should call mutate function with correct data when button is clicked', async () => {
    // @ts-expect-error Property 'mockResolvedValue' does not exist
    const mockRequest = api.delete.mockResolvedValue({});

    const { click } = renderDeleteCommentButtton();

    await waitFor(() => {
      expect(screen.getByRole('button')).toBeInTheDocument();
    });

    await click(screen.getByRole('button'));

    await waitFor(() => {
      expect(mockRequest).toHaveBeenCalled();
    });
  });
});

function renderDeleteCommentButtton() {
  const user = userEvent.setup();
  const renderResult = renderWithQueryClient(
    <BrowserRouter>
      <DeleteCommentButtton slug="test-slug" id={1} />
    </BrowserRouter>,
  );

  return { ...user, ...renderResult };
}
