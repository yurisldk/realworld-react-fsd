import { beforeEach, describe, expect, it } from '@jest/globals';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import { api } from '~shared/api/api.instance';
import { UserDto } from '~shared/api/api.types';
import { renderWithQueryClient } from '~shared/lib/test/test.lib';
import { Comment } from '~entities/comment/comment.types';
import { transformUserDtoToUser } from '~entities/session/session.lib';
import { CreateComment } from './create-comment.types';
import { CreateCommentForm } from './create-comment.ui';

describe('Create Comment Form', () => {
  beforeEach(() => {
    // @ts-expect-error Property 'mockResolvedValue' does not exist
    api.get.mockImplementation((url) => {
      if (url === '/user') {
        return Promise.resolve({ data: mockUserDto });
      }
      return Promise.reject(new Error('Unknown API endpoint'));
    });
  });

  it('should display the user image and username', async () => {
    renderCreateCommentForm();

    await waitFor(() => {
      expect(screen.getByAltText(mockUser.username)).toHaveAttribute('src', mockUser.image);
    });
  });

  it('should display validation error', async () => {
    const { type } = renderCreateCommentForm();

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /post comment/i }));
    });

    await type(screen.getByPlaceholderText('Write a comment...'), 'a[backspace]');

    await waitFor(() => {
      expect(screen.getAllByRole('alert')).toHaveLength(1);
    });
  });

  it('should call mutate function with correct data when form is submitted', async () => {
    // @ts-expect-error Property 'mockResolvedValue' does not exist
    const mockRequest = api.post.mockResolvedValue({});

    const { click, type } = renderCreateCommentForm();

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /post comment/i }));
    });

    await type(screen.getByPlaceholderText('Write a comment...'), mockCreateComment.body);

    await click(screen.getByRole('button', { name: /post comment/i }));

    await waitFor(() => {
      expect(mockRequest).toHaveBeenCalled();
    });
  });

  it('should clear the textarea after successful submission', async () => {
    const { click, type } = renderCreateCommentForm();

    // @ts-expect-error Property 'mockResolvedValue' does not exist
    api.post.mockResolvedValue({ data: { comment: mockComment } });

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /post comment/i }));
    });

    await type(screen.getByPlaceholderText('Write a comment...'), mockCreateComment.body);

    await click(screen.getByRole('button', { name: /post comment/i }));

    await waitFor(() => {
      expect(screen.getByPlaceholderText('Write a comment...')).toHaveValue('');
    });
  });

  it('should display error messages if the mutation fails', async () => {
    // @ts-expect-error Property 'mockResolvedValue' does not exist
    api.post.mockRejectedValue(new Error('Request failed'));

    const { click, type } = renderCreateCommentForm();

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /post comment/i }));
    });

    await type(screen.getByPlaceholderText('Write a comment...'), mockComment.body);

    await click(screen.getByRole('button', { name: /post comment/i }));

    await waitFor(() => {
      expect(screen.getByText(/Request failed/i)).toBeInTheDocument();
    });
  });
});

const mockUserDto: UserDto = {
  user: {
    email: 'mockuser@example.com',
    token: 'mock-jwt-token-12345',
    username: 'mockuser',
    bio: 'This is a mock bio of the user.',
    image: 'https://example.com/mockuser-image.jpg',
  },
};

const mockUser = transformUserDtoToUser(mockUserDto);

const mockCreateComment: CreateComment = {
  slug: 'test-slug',
  body: 'This is a mock comment body.',
};

const mockComment: Comment = {
  id: 1,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  body: 'This is a mock comment body.',
  author: {
    username: 'mockuser',
    bio: 'This is a mock bio of the author.',
    image: 'https://example.com/mockuser-image.jpg',
    following: true,
  },
};

function renderCreateCommentForm() {
  const user = userEvent.setup();
  const renderResult = renderWithQueryClient(
    <BrowserRouter>
      <CreateCommentForm slug="test-slug" />
    </BrowserRouter>,
  );

  return { ...user, ...renderResult };
}
