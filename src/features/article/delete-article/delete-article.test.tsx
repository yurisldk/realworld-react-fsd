import { screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { BrowserRouter, useNavigate } from 'react-router-dom'
import { describe, expect, it, Mock, vi } from 'vitest'
import { ArticleService } from '~shared/api/article'
import { pathKeys } from '~shared/lib/react-router'
import { renderWithQueryClient } from '~shared/lib/test'
import { spinnerModel } from '~shared/ui/spinner'
import { DeleteArticleButton } from './delete-article.ui'

describe('DeleteArticleButton', () => {
  it('should render the delete button', () => {
    renderDeleteArticleButton()

    expect(
      screen.getByRole('button', { name: /delete article/i }),
    ).toBeInTheDocument()
  })

  it('should show the spinner and navigate to home on mutation', async () => {
    const navigate = vi.fn()
    mockedUseNavigate.mockReturnValue(navigate)
    const globalSpinnerState = spinnerModel.globalSpinner.getState()
    const showSpy = vi.spyOn(globalSpinnerState, 'show')

    const { click } = renderDeleteArticleButton()

    await click(screen.getByRole('button', { name: /delete article/i }))

    await waitFor(() => {
      expect(showSpy).toHaveBeenCalled()
      expect(navigate).toHaveBeenCalledWith(pathKeys.home(), { replace: true })
    })
  })

  it('should navigate to the article page with an error state on mutation error', async () => {
    const navigate = vi.fn()
    mockedUseNavigate.mockReturnValue(navigate)

    vi.spyOn(ArticleService, 'deleteArticleMutation').mockRejectedValue({
      explanation: 'An error occurred',
    })

    const { click } = renderDeleteArticleButton()

    await click(screen.getByRole('button', { name: /delete article/i }))

    await waitFor(() => {
      expect(navigate).toHaveBeenCalledWith(
        pathKeys.article.bySlug({ slug: 'test-slug' }),
        {
          state: { error: { explanation: 'An error occurred' } },
          replace: true,
        },
      )
    })
  })

  it('should hide the spinner when the mutation is settled', async () => {
    const globalSpinnerState = spinnerModel.globalSpinner.getState()
    const hideSpy = vi.spyOn(globalSpinnerState, 'hide')

    const { click } = renderDeleteArticleButton()

    await click(screen.getByRole('button', { name: /delete article/i }))

    await waitFor(() => {
      expect(hideSpy).toHaveBeenCalled()
    })
  })
})

const mockedUseNavigate = useNavigate as Mock

function renderDeleteArticleButton() {
  const user = userEvent.setup()
  const renderResult = renderWithQueryClient(
    <BrowserRouter>
      <DeleteArticleButton slug="test-slug" />
    </BrowserRouter>,
  )

  return { ...user, ...renderResult }
}
