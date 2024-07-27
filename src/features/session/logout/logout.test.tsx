import { screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { BrowserRouter, useNavigate } from 'react-router-dom'
import { Mock, afterAll, beforeAll, describe, expect, it, vi } from 'vitest'
import { AuthService } from '~shared/api/auth'
import { pathKeys } from '~shared/lib/react-router'
import { renderWithQueryClient } from '~shared/lib/test'
import { LogoutButton } from './logout.ui'

describe('LogoutButton', () => {
  let mockedUseNavigate: Mock

  beforeAll(() => {
    mockedUseNavigate = useNavigate as Mock
    vi.spyOn(AuthService, 'logoutUserMutation').mockResolvedValue()
  })

  afterAll(() => {
    vi.resetAllMocks()
  })

  it('should navigate to home on successful logout', async () => {
    const navigate = vi.fn()
    mockedUseNavigate.mockReturnValue(navigate)

    const { click } = renderLogoutButton()

    await click(screen.getByRole('button', { name: /click here to logout/i }))

    await waitFor(() => {
      expect(navigate).toHaveBeenCalledWith(pathKeys.home())
    })
  })
})

function renderLogoutButton() {
  const user = userEvent.setup()
  const renderResult = renderWithQueryClient(
    <BrowserRouter>
      <LogoutButton />
    </BrowserRouter>,
  )

  return { ...user, ...renderResult }
}
