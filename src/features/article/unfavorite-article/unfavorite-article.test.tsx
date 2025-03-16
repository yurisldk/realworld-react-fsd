import { describe, expect, it } from '@jest/globals';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import { api } from '~shared/api/api.instance';
import { renderWithQueryClient } from '~shared/lib/test/test.lib';
import { Article } from '~entities/article/article.types';
import { UnfavoriteArticleBriefButton, UnfavoriteArticleExtendedButton } from './unfavorite-article.ui';

describe('UnfavoriteArticleButton', () => {
  describe('UnfavoriteArticleBriefButton', () => {
    it('should render the favorite button with the correct count', () => {
      renderUnfavoriteArticleBriefButton();

      expect(screen.getByRole('button'));
      expect(screen.getByText(mockArticle.favoritesCount)).toBeInTheDocument();
    });

    it('should trigger mutation and update favorites count when clicked', async () => {
      // @ts-expect-error Property 'mockResolvedValue' does not exist
      const mockRequest = api.delete.mockResolvedValue({});

      const { click } = renderUnfavoriteArticleBriefButton();

      await click(screen.getByRole('button'));

      await waitFor(() => {
        expect(mockRequest).toHaveBeenCalled();
      });
    });
  });

  describe('UnfavoriteArticleExtendedButton', () => {
    it('should render the favorite button with the correct count and text', () => {
      renderUnfavoriteArticleExtendedButton();

      expect(screen.getByRole('button', { name: /unfavorite article/i })).toBeInTheDocument();
      expect(screen.getByText(`(${mockArticle.favoritesCount})`)).toBeInTheDocument();
    });

    it('should trigger mutation and update favorites count when clicked', async () => {
      // @ts-expect-error Property 'mockResolvedValue' does not exist
      const mockRequest = api.delete.mockResolvedValue({});

      const { click } = renderUnfavoriteArticleExtendedButton();

      await click(screen.getByRole('button', { name: /unfavorite article/i }));

      await waitFor(() => {
        expect(mockRequest).toHaveBeenCalled();
      });
    });
  });
});

const mockArticle: Article = {
  slug: 'example-article',
  title: 'Example Article Title',
  description: 'This is a mock description of the article.',
  body: 'This is the body of the mock article. It contains detailed content.',
  tagList: ['mock', 'test', 'article'],
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  favorited: false,
  favoritesCount: 42,
  author: {
    username: 'mockUser',
    bio: 'This is a mock bio of the author.',
    image: 'https://example.com/mock-image.jpg',
    following: false,
  },
};

function renderUnfavoriteArticleBriefButton() {
  const user = userEvent.setup();
  const renderResult = renderWithQueryClient(
    <BrowserRouter>
      <UnfavoriteArticleBriefButton article={mockArticle} />
    </BrowserRouter>,
  );

  return { ...user, ...renderResult };
}

function renderUnfavoriteArticleExtendedButton() {
  const user = userEvent.setup();
  const renderResult = renderWithQueryClient(
    <BrowserRouter>
      <UnfavoriteArticleExtendedButton article={mockArticle} />
    </BrowserRouter>,
  );

  return { ...user, ...renderResult };
}
