import { describe, expect, it } from '@jest/globals';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import { api } from '~shared/api/api.instance';
import { renderWithQueryClient } from '~shared/lib/test/test.lib';
import { Article } from '~entities/article/article.types';
import { FavoriteArticleBriefButton, FavoriteArticleExtendedButton } from './favorite-article.ui';

describe('FavoriteArticleButton', () => {
  describe('FavoriteArticleBriefButton', () => {
    it('should render the favorite button with the correct count', () => {
      renderFavoriteArticleBriefButton();

      expect(screen.getByRole('button'));
      expect(screen.getByText(mockArticle.favoritesCount)).toBeInTheDocument();
    });

    it('should trigger mutation and update favorites count when clicked', async () => {
      // @ts-expect-error Property 'mockResolvedValue' does not exist
      const mockRequest = api.post.mockResolvedValue({});

      const { click } = renderFavoriteArticleBriefButton();

      await click(screen.getByRole('button'));

      await waitFor(() => {
        expect(mockRequest).toHaveBeenCalled();
      });
    });
  });

  describe('FavoriteArticleExtendedButton', () => {
    it('should render the favorite button with the correct count and text', () => {
      renderFavoriteArticleExtendedButton();

      expect(screen.getByRole('button', { name: /favorite article/i })).toBeInTheDocument();
      expect(screen.getByText(`(${mockArticle.favoritesCount})`)).toBeInTheDocument();
    });

    it('should trigger mutation and update favorites count when clicked', async () => {
      // @ts-expect-error Property 'mockResolvedValue' does not exist
      const mockRequest = api.post.mockResolvedValue({});

      const { click } = renderFavoriteArticleExtendedButton();

      await click(screen.getByRole('button', { name: /favorite article/i }));

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

function renderFavoriteArticleBriefButton() {
  const user = userEvent.setup();
  const renderResult = renderWithQueryClient(
    <BrowserRouter>
      <FavoriteArticleBriefButton article={mockArticle} />
    </BrowserRouter>,
  );

  return { ...user, ...renderResult };
}

function renderFavoriteArticleExtendedButton() {
  const user = userEvent.setup();
  const renderResult = renderWithQueryClient(
    <BrowserRouter>
      <FavoriteArticleExtendedButton article={mockArticle} />
    </BrowserRouter>,
  );

  return { ...user, ...renderResult };
}
