import { screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { BrowserRouter, useNavigate } from 'react-router-dom'
import { Mock, describe, expect, it, vi } from 'vitest'
import { AuthService, authTypesDto } from '~shared/api/auth'
import { pathKeys } from '~shared/lib/react-router'
import { renderWithQueryClient } from '~shared/lib/test'
import { useSessionStore } from '~shared/session'
import { LoginForm } from './login.ui'

describe('LoginForm', () => {
  it('should render login form', () => {
    renderLoginForm()

    expect(screen.getByPlaceholderText('Email')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('Password')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /sign in/i })).toBeInTheDocument()
  })

  it('displays validation errors when form fields are invalid', async () => {
    const { click, type } = renderLoginForm()

    await type(screen.getByPlaceholderText('Email'), 'test')
    await type(screen.getByPlaceholderText('Password'), 'test')
    await click(screen.getByRole('button', { name: /sign in/i }))

    await waitFor(() => {
      expect(screen.getAllByRole('listitem')).toHaveLength(2)
    })
  })

  it('should call login mutation on valid form submission', async () => {
    const loginUserMutation = vi
      .spyOn(AuthService, 'loginUserMutation')
      .mockResolvedValue(userDto)

    const { click, type } = renderLoginForm()

    await type(screen.getByPlaceholderText('Email'), loginUserDto.email)
    await type(screen.getByPlaceholderText('Password'), loginUserDto.password)
    await click(screen.getByRole('button', { name: /sign in/i }))

    await waitFor(() => {
      expect(loginUserMutation).toHaveBeenCalledWith({ user: loginUserDto })
    })
  })

  it('should navigate to profile on successful login', async () => {
    const navigate = vi.fn()
    mockedUseNavigate.mockReturnValue(navigate)
    const session = useSessionStore.getState()
    const setSession = vi.spyOn(session, 'setSession')
    vi.spyOn(AuthService, 'loginUserMutation').mockResolvedValue(userDto)

    const { click, type } = renderLoginForm()

    await type(screen.getByPlaceholderText('Email'), loginUserDto.email)
    await type(screen.getByPlaceholderText('Password'), loginUserDto.password)
    await click(screen.getByRole('button', { name: /sign in/i }))

    await waitFor(() => {
      expect(setSession).toHaveBeenCalledWith(userDto.user)
      expect(navigate).toHaveBeenCalledWith(
        pathKeys.profile.byUsername({ username: userDto.user.username }),
      )
    })
  })

  it('should display error message on login failure', async () => {
    vi.spyOn(AuthService, 'loginUserMutation').mockRejectedValue({
      message: 'Invalid credentials',
    })

    const { click, type } = renderLoginForm()

    await type(screen.getByPlaceholderText('Email'), 'test@example.com')
    await type(screen.getByPlaceholderText('Password'), 'password123')
    await click(screen.getByRole('button', { name: /sign in/i }))

    await waitFor(() => {
      expect(screen.getByText(/invalid credentials/i)).toBeInTheDocument()
    })
  })
})

const mockedUseNavigate = useNavigate as Mock

function renderLoginForm() {
  const user = userEvent.setup()
  const renderResult = renderWithQueryClient(
    <BrowserRouter>
      <LoginForm />
    </BrowserRouter>,
  )

  return { ...user, ...renderResult }
}

const userDto: authTypesDto.UserDto = {
  user: {
    email: 'test@example.com',
    username: 'username',
    bio: 'bio',
    image: 'image',
    token: 'token',
  },
}

const loginUserDto: authTypesDto.LoginUserDto = {
  email: 'test@example.com',
  password: 'password',
}
