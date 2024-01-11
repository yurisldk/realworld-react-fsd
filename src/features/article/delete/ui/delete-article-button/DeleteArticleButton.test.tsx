import { screen } from '@testing-library/react';
import { vi } from 'vitest';
import { realworldApi } from '~shared/api/realworld';
import { renderWithRouter } from '~shared/lib/react-router';
import { useDeleteArticle } from '../../api/deleteArticle';
import { DeleteArticleButton } from './DeleteArticleButton';

vi.mock('../../api/deleteArticle', () => ({
  useDeleteArticle: vi.fn(() => ({
    mutate: vi.fn().mockImplementation(() => {}),
  })),
}));

describe('<DeleteArticleButton />', () => {
  beforeEach(() => {
    vi.spyOn(realworldApi.articles, 'deleteArticle');
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should render the delete button', () => {
    renderWithRouter(<DeleteArticleButton slug="article-slug" />);

    const deleteButton = screen.getByText('Delete Article');
    expect(deleteButton).toBeDefined();
  });

  it('should call the delete article API and navigates to root path on successful deletion', async () => {
    const { user } = renderWithRouter(
      <DeleteArticleButton slug="article-slug" />,
    );
    const deleteButton = screen.getByText('Delete Article');

    await user.click(deleteButton);

    expect(useDeleteArticle).toHaveBeenCalledTimes(1);
    expect(window.location.pathname).toBe('/');
  });
});
