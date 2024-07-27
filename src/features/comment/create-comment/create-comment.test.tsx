import { screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { BrowserRouter } from 'react-router-dom'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { AuthService, authTypesDto } from '~shared/api/auth'
import { CommentService } from '~shared/api/comment'
import { AxiosLib } from '~shared/lib/axios'
import { renderWithQueryClient } from '~shared/lib/test'
import { sessionLib, useSessionStore, sessionTypes } from '~shared/session'
import { transformCreateCommentDtoToComment } from './create-comment.lib'
import { CreateCommentForm } from './create-comment.ui'

describe('Create Comment Form', () => {
  beforeEach(() => {
    vi.spyOn(AuthService, 'currentUserQuery').mockResolvedValue(
      AxiosLib.mockResolvedAxiosResponse({
        user: session,
      }),
    )
    useSessionStore.getState().setSession(session)
  })

  it('should display the user image and username', async () => {
    renderCreateCommentForm()

    await waitFor(() => {
      expect(screen.getByAltText(session.username)).toHaveAttribute(
        'src',
        session.image,
      )
    })
  })

  it('should display validation error', async () => {
    const { type } = renderCreateCommentForm()

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /post comment/i }))
    })

    await type(
      screen.getByPlaceholderText('Write a comment...'),
      'a[backspace]',
    )

    await waitFor(() => {
      expect(screen.getAllByRole('listitem')).toHaveLength(1)
    })
  })

  it('should call mutate function with correct data when form is submitted', async () => {
    const createCommentMutationSpy = vi
      .spyOn(CommentService, 'createCommentMutation')
      .mockResolvedValue(AxiosLib.mockResolvedAxiosResponse({ comment }))

    const { click, type } = renderCreateCommentForm()

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /post comment/i }))
    })

    await type(screen.getByPlaceholderText('Write a comment...'), comment.body)

    await click(screen.getByRole('button', { name: /post comment/i }))

    await waitFor(() => {
      expect(createCommentMutationSpy).toHaveBeenCalledWith('test-slug', {
        createCommentDto: { body: comment.body },
      })
    })
  })

  it('should clear the textarea after successful submission', async () => {
    const { click, type } = renderCreateCommentForm()

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /post comment/i }))
    })

    await type(screen.getByPlaceholderText('Write a comment...'), comment.body)

    await click(screen.getByRole('button', { name: /post comment/i }))

    await waitFor(() => {
      expect(screen.getByPlaceholderText('Write a comment...')).toHaveValue('')
    })
  })

  it('should display error messages if the mutation fails', async () => {
    vi.spyOn(CommentService, 'createCommentMutation').mockRejectedValue({
      message: 'An error occurred',
    })

    const { click, type } = renderCreateCommentForm()

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /post comment/i }))
    })

    await type(screen.getByPlaceholderText('Write a comment...'), comment.body)

    await click(screen.getByRole('button', { name: /post comment/i }))

    await waitFor(() => {
      expect(screen.getByText(/An error occurred/i)).toBeInTheDocument()
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

const session: sessionTypes.Session =
  sessionLib.transformUserDtoToSession(userDto)

const comment = transformCreateCommentDtoToComment({
  createCommentDto: { body: 'This is a test comment' },
  session,
})

function renderCreateCommentForm() {
  const user = userEvent.setup()
  const renderResult = renderWithQueryClient(
    <BrowserRouter>
      <CreateCommentForm slug="test-slug" />
    </BrowserRouter>,
  )

  return { ...user, ...renderResult }
}
