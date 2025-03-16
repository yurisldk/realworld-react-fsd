import { describe, it, expect, jest } from '@jest/globals';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter, useNavigate } from 'react-router-dom';
import { api } from '~shared/api/api.instance';
import { UserDto } from '~shared/api/api.types';
import { renderWithQueryClient } from '~shared/lib/test/test.lib';
import { RegisterUser } from './register.types';
import RegisterForm from './register.ui';

describe('RegisterForm', () => {
  it('renders the registration form', () => {
    renderRegisterForm();

    expect(screen.getByPlaceholderText('Your Name')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Email')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Password')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /sign up/i })).toBeInTheDocument();
  });

  it('displays validation errors when form fields are invalid', async () => {
    const { click, type } = renderRegisterForm();

    await type(screen.getByPlaceholderText('Your Name'), 'test');
    await type(screen.getByPlaceholderText('Email'), 'test');
    await type(screen.getByPlaceholderText('Password'), 'test');
    await click(screen.getByRole('button', { name: /sign up/i }));

    await waitFor(() => {
      expect(screen.getAllByRole('alert')).toHaveLength(3);
    });
  });

  it('submits the form and navigates to profile page on successful registration', async () => {
    const navigate = jest.fn();
    // @ts-expect-error Property 'mockResolvedValue' does not exist
    useNavigate.mockReturnValue(navigate);
    // @ts-expect-error Property 'mockResolvedValue' does not exist
    const mockRequest = api.post.mockResolvedValue({ data: mockUserDto });

    const { click, type } = renderRegisterForm();

    await type(screen.getByPlaceholderText('Your Name'), mockRegisterUser.username);
    await type(screen.getByPlaceholderText('Email'), mockRegisterUser.email);
    await type(screen.getByPlaceholderText('Password'), mockRegisterUser.password);
    await click(screen.getByRole('button', { name: /sign up/i }));

    await waitFor(() => {
      expect(mockRequest).toHaveBeenCalled();
      expect(navigate).toHaveBeenCalled();
    });
  });

  it('displays error message on registration failure', async () => {
    // @ts-expect-error Property 'mockResolvedValue' does not exist
    api.post.mockRejectedValue(new Error('Request failed'));

    const { click, type } = renderRegisterForm();

    await type(screen.getByPlaceholderText('Your Name'), mockRegisterUser.username);
    await type(screen.getByPlaceholderText('Email'), mockRegisterUser.email);
    await type(screen.getByPlaceholderText('Password'), mockRegisterUser.password);
    await click(screen.getByRole('button', { name: /sign up/i }));

    await waitFor(() => {
      expect(screen.getByText('Request failed')).toBeInTheDocument();
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

const mockRegisterUser: RegisterUser = {
  username: 'mockuser',
  email: 'mockuser@example.com',
  password: 'mockuserpassword',
};

function renderRegisterForm() {
  const user = userEvent.setup();
  const renderResult = renderWithQueryClient(
    <BrowserRouter>
      <RegisterForm />
    </BrowserRouter>,
  );

  return { ...user, ...renderResult };
}
