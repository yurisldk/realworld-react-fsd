import { screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { BrowserRouter, useNavigate } from 'react-router-dom'
import { describe, it, expect, vi, Mock } from 'vitest'
import { AuthService, authTypesDto } from '~shared/api/auth'
import { pathKeys } from '~shared/lib/react-router'
import { renderWithQueryClient } from '~shared/lib/test'
import { useSessionStore } from '~shared/session'
import { RegisterForm } from './register.ui'

describe('RegisterForm', () => {
  it('renders the registration form', () => {
    renderRegisterForm()

    expect(screen.getByPlaceholderText('Your Name')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('Email')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('Password')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /sign up/i })).toBeInTheDocument()
  })

  it('displays validation errors when form fields are invalid', async () => {
    const { click, type } = renderRegisterForm()

    await type(screen.getByPlaceholderText('Your Name'), 'test')
    await type(screen.getByPlaceholderText('Email'), 'test')
    await type(screen.getByPlaceholderText('Password'), 'test')
    await click(screen.getByRole('button', { name: /sign up/i }))

    await waitFor(() => {
      expect(screen.getAllByRole('listitem')).toHaveLength(3)
    })
  })

  it('submits the form and navigates to profile page on successful registration', async () => {
    const navigate = vi.fn()
    mockedUseNavigate.mockReturnValue(navigate)

    const createUserMutation = vi
      .spyOn(AuthService, 'createUserMutation')
      .mockResolvedValue(userDto)

    const session = useSessionStore.getState()
    const setSession = vi.spyOn(session, 'setSession')

    const { click, type } = renderRegisterForm()

    await type(screen.getByPlaceholderText('Your Name'), createUserDto.username)
    await type(screen.getByPlaceholderText('Email'), createUserDto.email)
    await type(screen.getByPlaceholderText('Password'), createUserDto.password)
    await click(screen.getByRole('button', { name: /sign up/i }))

    await waitFor(() => {
      expect(createUserMutation).toHaveBeenCalledWith({ user: createUserDto })
      expect(setSession).toHaveBeenCalledWith(userDto.user)
      expect(navigate).toHaveBeenCalledWith(
        pathKeys.profile.byUsername({ username: userDto.user.username }),
      )
    })
  })

  it('displays error message on registration failure', async () => {
    vi.spyOn(AuthService, 'createUserMutation').mockRejectedValue({
      message: 'Error explanation',
    })

    const { click, type } = renderRegisterForm()

    await type(screen.getByPlaceholderText('Your Name'), createUserDto.username)
    await type(screen.getByPlaceholderText('Email'), createUserDto.email)
    await type(screen.getByPlaceholderText('Password'), createUserDto.password)
    await click(screen.getByRole('button', { name: /sign up/i }))

    await waitFor(() => {
      expect(screen.getByText('Error explanation')).toBeInTheDocument()
    })
  })
})

const mockedUseNavigate = useNavigate as Mock

const userDto: authTypesDto.UserDto = {
  user: {
    email: 'test@example.com',
    username: 'username',
    bio: 'bio',
    image: 'image',
    token: 'token',
  },
}

const createUserDto: authTypesDto.CreateUserDto = {
  username: 'username',
  email: 'test@example.com',
  password: 'password',
}

function renderRegisterForm() {
  const user = userEvent.setup()
  const renderResult = renderWithQueryClient(
    <BrowserRouter>
      <RegisterForm />
    </BrowserRouter>,
  )

  return { ...user, ...renderResult }
}
