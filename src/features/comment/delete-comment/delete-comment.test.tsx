import { screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { BrowserRouter } from 'react-router-dom'
import { describe, expect, it, vi } from 'vitest'
import { CommentService } from '~shared/api/comment'
import { renderWithQueryClient } from '~shared/lib/test'
import { DeleteCommentButtton } from './delete-comment.ui'

describe('Delete Comment Button', () => {
  it('should display the delete icon', () => {
    renderDeleteCommentButtton()

    expect(screen.getByRole('button')).toBeInTheDocument()
  })

  it('should call mutate function with correct data when button is clicked', async () => {
    const deleteCommentMutationSpy = vi
      .spyOn(CommentService, 'deleteCommentMutation')
      .mockResolvedValue({})

    const { click } = renderDeleteCommentButtton()

    await waitFor(() => {
      expect(screen.getByRole('button')).toBeInTheDocument()
    })

    await click(screen.getByRole('button'))

    await waitFor(() => {
      expect(deleteCommentMutationSpy).toHaveBeenCalledWith({
        slug: 'test-slug',
        id: 1,
      })
    })
  })
})

function renderDeleteCommentButtton() {
  const user = userEvent.setup()
  const renderResult = renderWithQueryClient(
    <BrowserRouter>
      <DeleteCommentButtton
        slug="test-slug"
        id={1}
      />
    </BrowserRouter>,
  )

  return { ...user, ...renderResult }
}
