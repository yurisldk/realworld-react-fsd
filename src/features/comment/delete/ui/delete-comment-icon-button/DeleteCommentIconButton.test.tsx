import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi } from 'vitest';
import { realworldApi } from '~shared/api/realworld';
import { renderWithClient } from '~shared/lib/react-query';
import { useDeleteComment } from '../../api/deleteComment';
import { DeleteCommentIconButtton } from './DeleteCommentIconButtton';

vi.mock('../../api/deleteComment', () => ({
  useDeleteComment: vi.fn(() => ({
    mutate: vi.fn().mockImplementation(() => {}),
  })),
}));

describe('<DeleteCommentIconButtton />', () => {
  beforeEach(() => {
    vi.spyOn(realworldApi.articles, 'deleteArticleComment');
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should render the delete button', () => {
    renderWithClient(<DeleteCommentIconButtton slug="slug" id={1} />);

    const deleteButton = screen.getByRole('button');
    expect(deleteButton).toBeInTheDocument();
  });

  it('should call the delete article API', async () => {
    renderWithClient(<DeleteCommentIconButtton slug="slug" id={1} />);
    const deleteButton = screen.getByRole('button');

    await userEvent.click(deleteButton);

    expect(useDeleteComment).toHaveBeenCalledTimes(1);
  });
});
