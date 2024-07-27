import { screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { BrowserRouter } from 'react-router-dom'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { AuthService, authTypesDto } from '~shared/api/auth'
import { AxiosLib } from '~shared/lib/axios'
import { renderWithQueryClient } from '~shared/lib/test'
import { sessionLib, sessionTypes } from '~shared/session'
import { UpdateSessionForm } from './update-session.ui'

describe('UpdateSessionForm', () => {
  beforeEach(() => {
    vi.spyOn(AuthService, 'currentUserQuery').mockResolvedValue(
      AxiosLib.mockResolvedAxiosResponse(userDto),
    )
  })

  it('should render the form with user details', async () => {
    renderUpdateSessionForm()

    await waitFor(() => {
      expect(screen.getByPlaceholderText('URL of profile picture')).toHaveValue(
        session.image,
      )
      expect(screen.getByPlaceholderText('Your Name')).toHaveValue(
        session.username,
      )
      expect(screen.getByPlaceholderText('Short bio about you')).toHaveValue(
        session.bio,
      )
      expect(screen.getByPlaceholderText('Email')).toHaveValue(session.email)
    })
  })

  it('should display validation errors if form is submitted with invalid data', async () => {
    const { click, type } = renderUpdateSessionForm()

    await waitFor(() => {
      expect(screen.getByPlaceholderText('Email')).toHaveValue(session.email)
    })

    await type(screen.getByPlaceholderText('Email'), 'invalid-email')
    await click(screen.getByRole('button', { name: /update settings/i }))

    await waitFor(() => {
      expect(screen.getByText(/invalid email/i)).toBeInTheDocument()
    })
  })

  it('should call the mutation function with form data when submitted', async () => {
    const updateUserMutationSpy = vi
      .spyOn(AuthService, 'updateUserMutation')
      .mockResolvedValue(AxiosLib.mockResolvedAxiosResponse(userDto))

    const { click, type, clear } = renderUpdateSessionForm()

    await waitFor(() => {
      expect(screen.getByPlaceholderText('Email')).toHaveValue(session.email)
    })

    await clear(screen.getByPlaceholderText('Your Name'))
    await type(screen.getByPlaceholderText('Your Name'), updateUserDto.username)
    await click(screen.getByRole('button', { name: /update settings/i }))

    await waitFor(() => {
      expect(updateUserMutationSpy).toHaveBeenCalledWith({ updateUserDto })
    })
  })
})

const userDto: authTypesDto.UserDto = {
  user: {
    username: 'testuser',
    email: 'testuser@example.com',
    bio: 'A short bio',
    image: 'http://example.com/profile.jpg',
    token: 'testtoken',
  },
}

const updateUserDto = {
  username: 'updatedtestuser',
  email: userDto.user.email,
  bio: userDto.user.bio,
  image: userDto.user.image,
  password: '',
}

const session: sessionTypes.Session =
  sessionLib.transformUserDtoToSession(userDto)

function renderUpdateSessionForm() {
  const user = userEvent.setup()
  const renderResult = renderWithQueryClient(
    <BrowserRouter>
      <UpdateSessionForm />
    </BrowserRouter>,
  )

  return { ...user, ...renderResult }
}
