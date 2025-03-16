import { describe, expect, it, jest } from '@jest/globals';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useNavigate, BrowserRouter } from 'react-router-dom';
import { api } from '~shared/api/api.instance';
import { renderWithQueryClient } from '~shared/lib/test/test.lib';
import { Article } from '~entities/article/article.types';
import { CreateArticle } from './create-article.types';
import { CreateArticleForm } from './create-article.ui';

describe('CreateArticleForm', () => {
  it('should render the form with all input fields', () => {
    renderCreateArticleForm();

    expect(screen.getByPlaceholderText('Article Title')).toBeInTheDocument();
    expect(screen.getByPlaceholderText("What's this article about?")).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Write your article (in markdown)')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Enter tags')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /publish article/i })).toBeInTheDocument();
  });

  it('should display validation errors when required fields are empty', async () => {
    const { type } = renderCreateArticleForm();

    await type(screen.getByPlaceholderText('Article Title'), '[Tab]');
    await type(screen.getByPlaceholderText("What's this article about?"), '[Tab]');
    await type(screen.getByPlaceholderText('Write your article (in markdown)'), '[Tab]');

    await waitFor(() => {
      expect(screen.getAllByRole('alert')).toHaveLength(3);
    });
  });

  it('should call mutate when the form is valid and submitted', async () => {
    // @ts-expect-error Property 'mockResolvedValue' does not exist
    const mockRequest = api.post.mockResolvedValue({ data: { article: mockArticle } });

    const { click, type } = renderCreateArticleForm();

    await type(screen.getByPlaceholderText('Article Title'), mockCreateArticle.title);
    await type(screen.getByPlaceholderText("What's this article about?"), mockCreateArticle.description);
    await type(screen.getByPlaceholderText('Write your article (in markdown)'), mockCreateArticle.body);
    await type(screen.getByPlaceholderText('Enter tags'), mockCreateArticle.tagList!);

    await click(screen.getByRole('button', { name: /publish article/i }));

    await waitFor(() => {
      expect(mockRequest).toHaveBeenCalled();
    });
  });

  it('should navigate to the article page on successful mutation', async () => {
    const navigate = jest.fn();
    // @ts-expect-error Property 'mockResolvedValue' does not exist
    useNavigate.mockReturnValue(navigate);
    // @ts-expect-error Property 'mockResolvedValue' does not exist
    api.post.mockResolvedValue({ data: { article: mockArticle } });

    const { click, type } = renderCreateArticleForm();

    await type(screen.getByPlaceholderText('Article Title'), mockCreateArticle.title);
    await type(screen.getByPlaceholderText("What's this article about?"), mockCreateArticle.description);
    await type(screen.getByPlaceholderText('Write your article (in markdown)'), mockCreateArticle.body);
    await type(screen.getByPlaceholderText('Enter tags'), mockCreateArticle.tagList!);

    await click(screen.getByRole('button', { name: /publish article/i }));

    await waitFor(() => {
      expect(navigate).toHaveBeenCalled();
    });
  });

  it('should display server errors on mutation error', async () => {
    // @ts-expect-error Property 'mockResolvedValue' does not exist
    api.post.mockRejectedValue(new Error('Request failed'));

    const { click, type } = renderCreateArticleForm();

    await type(screen.getByPlaceholderText('Article Title'), mockCreateArticle.title);
    await type(screen.getByPlaceholderText("What's this article about?"), mockCreateArticle.description);
    await type(screen.getByPlaceholderText('Write your article (in markdown)'), mockCreateArticle.body);
    await type(screen.getByPlaceholderText('Enter tags'), mockCreateArticle.tagList!);

    await click(screen.getByRole('button', { name: /publish article/i }));

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

const mockCreateArticle: CreateArticle = {
  body: 'test-body',
  description: 'test-descriprion',
  title: 'test-title',
  tagList: 'test-tag-1, test-tag-2',
};

function renderCreateArticleForm() {
  const user = userEvent.setup();
  const renderResult = renderWithQueryClient(
    <BrowserRouter>
      <CreateArticleForm />
    </BrowserRouter>,
  );

  return { ...user, ...renderResult };
}
