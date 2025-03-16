import { beforeEach, describe, expect, it } from '@jest/globals';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import { api } from '~shared/api/api.instance';
import { UserDto } from '~shared/api/api.types';
import { renderWithQueryClient } from '~shared/lib/test/test.lib';
import { transformUserDtoToUser } from '~entities/session/session.lib';
import { UpdateUser } from './update.types';
import UpdateSessionForm from './update.ui';

describe('UpdateSessionForm', () => {
  beforeEach(() => {
    // @ts-expect-error Property 'mockResolvedValue' does not exist
    api.get.mockImplementation((url) => {
      if (url === '/user') {
        return Promise.resolve({ data: mockUserDto });
      }
      return Promise.reject(new Error('Unknown API endpoint'));
    });
  });

  it('should render the form with user details', async () => {
    renderUpdateSessionForm();

    await waitFor(() => {
      expect(screen.getByPlaceholderText('URL of profile picture')).toHaveValue(mockUser.image);
      expect(screen.getByPlaceholderText('Your Name')).toHaveValue(mockUser.username);
      expect(screen.getByPlaceholderText('Short bio about you')).toHaveValue(mockUser.bio);
      expect(screen.getByPlaceholderText('Email')).toHaveValue(mockUser.email);
    });
  });

  it('should display validation errors if form is submitted with invalid data', async () => {
    const { click, type } = renderUpdateSessionForm();

    await waitFor(() => {
      expect(screen.getByPlaceholderText('Email')).toHaveValue(mockUser.email);
    });

    await type(screen.getByPlaceholderText('Email'), 'invalid-email');
    await click(screen.getByRole('button', { name: /update settings/i }));

    await waitFor(() => {
      expect(screen.getByText(/invalid email/i)).toBeInTheDocument();
    });
  });

  it('should call the mutation function with form data when submitted', async () => {
    // @ts-expect-error Property 'mockResolvedValue' does not exist
    const mockRequest = api.put.mockResolvedValue({ data: mockUserDto });

    const { click, type, clear } = renderUpdateSessionForm();

    await waitFor(() => {
      expect(screen.getByPlaceholderText('Email')).toHaveValue(mockUser.email);
    });

    await clear(screen.getByPlaceholderText('Your Name'));
    await type(screen.getByPlaceholderText('Your Name'), mockUpdateUser.username!);
    await click(screen.getByRole('button', { name: /update settings/i }));

    await waitFor(() => {
      expect(mockRequest).toHaveBeenCalled();
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

const mockUpdateUser: UpdateUser = {
  email: 'mockuser@example.com',
  password: '',
  username: 'mockuser-updated',
};

function renderUpdateSessionForm() {
  const user = userEvent.setup();
  const renderResult = renderWithQueryClient(
    <BrowserRouter>
      <UpdateSessionForm />
    </BrowserRouter>,
  );

  return { ...user, ...renderResult };
}
