import { describe, expect, it, jest } from '@jest/globals';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter, useNavigate } from 'react-router-dom';
import { api } from '~shared/api/api.instance';
import { UserDto } from '~shared/api/api.types';
import { renderWithQueryClient } from '~shared/lib/test/test.lib';
import { LoginUser } from './login.types';
import LoginForm from './login.ui';

describe('LoginForm', () => {
  it('should render login form', () => {
    renderLoginForm();

    expect(screen.getByPlaceholderText('Email')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Password')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /sign in/i })).toBeInTheDocument();
  });

  it('displays validation errors when form fields are invalid', async () => {
    const { click, type } = renderLoginForm();

    await type(screen.getByPlaceholderText('Email'), 'test');
    await type(screen.getByPlaceholderText('Password'), 'test');
    await click(screen.getByRole('button', { name: /sign in/i }));

    await waitFor(() => {
      expect(screen.getAllByRole('alert')).toHaveLength(2);
    });
  });

  it('should call login mutation on valid form submission', async () => {
    // @ts-expect-error Property 'mockResolvedValue' does not exist
    const mockRequest = api.post.mockResolvedValue({});

    const { click, type } = renderLoginForm();

    await type(screen.getByPlaceholderText('Email'), mockLoginUser.email);
    await type(screen.getByPlaceholderText('Password'), mockLoginUser.password);
    await click(screen.getByRole('button', { name: /sign in/i }));

    await waitFor(() => {
      expect(mockRequest).toHaveBeenCalled();
    });
  });

  it('should navigate to profile on successful login', async () => {
    const navigate = jest.fn();
    // @ts-expect-error Property 'mockResolvedValue' does not exist
    useNavigate.mockReturnValue(navigate);
    // @ts-expect-error Property 'mockResolvedValue' does not exist
    api.post.mockResolvedValue({ data: mockUserDto });

    const { click, type } = renderLoginForm();

    await type(screen.getByPlaceholderText('Email'), mockLoginUser.email);
    await type(screen.getByPlaceholderText('Password'), mockLoginUser.password);
    await click(screen.getByRole('button', { name: /sign in/i }));

    await waitFor(() => {
      expect(navigate).toHaveBeenCalled();
    });
  });

  it('should display error message on login failure', async () => {
    // @ts-expect-error Property 'mockResolvedValue' does not exist
    api.post.mockRejectedValue(new Error('Request failed'));

    const { click, type } = renderLoginForm();

    await type(screen.getByPlaceholderText('Email'), 'test@example.com');
    await type(screen.getByPlaceholderText('Password'), 'password123');
    await click(screen.getByRole('button', { name: /sign in/i }));

    await waitFor(() => {
      expect(screen.getByText(/Request failed/i)).toBeInTheDocument();
    });
  });
});

function renderLoginForm() {
  const user = userEvent.setup();
  const renderResult = renderWithQueryClient(
    <BrowserRouter>
      <LoginForm />
    </BrowserRouter>,
  );

  return { ...user, ...renderResult };
}

const mockLoginUser: LoginUser = {
  email: 'mockuser@example.com',
  password: 'mockuserpassword',
};

const mockUserDto: UserDto = {
  user: {
    email: 'mockuser@example.com',
    token: 'mock-jwt-token-12345',
    username: 'mockuser',
    bio: 'This is a mock bio of the user.',
    image: 'https://example.com/mockuser-image.jpg',
  },
};
