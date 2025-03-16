import { beforeEach, describe, expect, it, jest } from '@jest/globals';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter, useNavigate } from 'react-router-dom';
import { api } from '~shared/api/api.instance';
import { renderWithQueryClient } from '~shared/lib/test/test.lib';
import { Article } from '~entities/article/article.types';
import { UpdateArticleForm } from './update-article.ui';

describe('UpdateArticleForm', () => {
  beforeEach(() => {
    // @ts-expect-error Property 'mockResolvedValue' does not exist
    api.get.mockImplementation((url) => {
      if (url === `/articles/${mockArticle.slug}`) {
        return Promise.resolve({ data: { article: mockArticle } });
      }
      return Promise.reject(new Error('Unknown API endpoint'));
    });
  });

  it('should render the form with the correct initial values', async () => {
    renderUpdateArticleForm();

    await waitFor(() => {
      expect(screen.getByPlaceholderText('Article Title')).toHaveValue(mockArticle.title);
      expect(screen.getByPlaceholderText("What's this article about?")).toHaveValue(mockArticle.description);
      expect(screen.getByPlaceholderText('Write your article (in markdown)')).toHaveValue(mockArticle.body);
      expect(screen.getByPlaceholderText('Enter tags')).toHaveValue(mockArticle.tagList.join(', '));
    });
  });

  it('should call the mutation with the updated article on form submission', async () => {
    // @ts-expect-error Property 'mockResolvedValue' does not exist
    const mockRequest = api.put.mockResolvedValue({});

    const { click, type, clear } = renderUpdateArticleForm();

    await waitFor(() => {
      expect(screen.getByPlaceholderText('Article Title')).toHaveValue(mockArticle.title);
    });

    await clear(screen.getByPlaceholderText('Article Title'));
    await type(screen.getByPlaceholderText('Article Title'), mockUpdateArticle.title);

    await clear(screen.getByPlaceholderText("What's this article about?"));
    await type(screen.getByPlaceholderText("What's this article about?"), mockUpdateArticle.description);

    await clear(screen.getByPlaceholderText('Write your article (in markdown)'));
    await type(screen.getByPlaceholderText('Write your article (in markdown)'), mockUpdateArticle.body);

    await clear(screen.getByPlaceholderText('Enter tags'));
    await type(screen.getByPlaceholderText('Enter tags'), mockUpdateArticle.tagList);

    await click(screen.getByRole('button', { name: /update article/i }));

    await waitFor(() => {
      expect(mockRequest).toHaveBeenCalled();
    });
  });

  it('should navigate to the article page on successful mutation', async () => {
    const navigate = jest.fn();
    // @ts-expect-error Property 'mockResolvedValue' does not exist
    useNavigate.mockReturnValue(navigate);
    // @ts-expect-error Property 'mockResolvedValue' does not exist
    api.put.mockResolvedValue({ data: { article: mockArticle } });

    const { click, type, clear } = renderUpdateArticleForm();

    await waitFor(() => {
      expect(screen.getByPlaceholderText('Article Title')).toHaveValue(mockArticle.title);
    });

    await clear(screen.getByPlaceholderText("What's this article about?"));
    await type(screen.getByPlaceholderText("What's this article about?"), 'Updated Description');

    await click(screen.getByRole('button', { name: /update article/i }));

    await waitFor(() => {
      expect(navigate).toHaveBeenCalled();
    });
  });

  it('should display server errors on mutation error', async () => {
    // @ts-expect-error Property 'mockResolvedValue' does not exist
    api.put.mockRejectedValue(new Error('Request failed'));

    const { click, type, clear } = renderUpdateArticleForm();

    await waitFor(() => {
      expect(screen.getByPlaceholderText('Article Title')).toHaveValue(mockArticle.title);
    });

    await clear(screen.getByPlaceholderText("What's this article about?"));
    await type(screen.getByPlaceholderText("What's this article about?"), 'Updated Description');

    await click(screen.getByRole('button', { name: /update article/i }));

    await waitFor(() => {
      expect(screen.getByText('Request failed')).toBeInTheDocument();
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

const mockUpdateArticle = {
  title: 'Updated Article Title',
  description: 'Updated description for the article.',
  body: 'This is the updated body of the article.',
  tagList: 'updated, test, article',
};

function renderUpdateArticleForm() {
  const user = userEvent.setup();
  const renderResult = renderWithQueryClient(
    <BrowserRouter>
      <UpdateArticleForm slug={mockArticle.slug} />
    </BrowserRouter>,
  );

  return { ...user, ...renderResult };
}
