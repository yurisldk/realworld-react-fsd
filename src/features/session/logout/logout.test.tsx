import { screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { BrowserRouter, useNavigate } from 'react-router-dom'
import {
  Mock,
  MockInstance,
  afterAll,
  beforeAll,
  describe,
  expect,
  it,
  vi,
} from 'vitest'
import { AuthService } from '~shared/api/auth'
import { pathKeys } from '~shared/lib/react-router'
import { renderWithQueryClient } from '~shared/lib/test'
import { useSessionStore } from '~shared/session'
import { LogoutButton } from './logout.ui'

describe('LogoutButton', () => {
  let mockedUseNavigate: Mock
  let resetSessionSpy: MockInstance<[], void>

  beforeAll(() => {
    mockedUseNavigate = useNavigate as Mock
    const session = useSessionStore.getState()
    resetSessionSpy = vi.spyOn(session, 'resetSession')
    vi.spyOn(AuthService, 'logoutUserMutation').mockResolvedValue()
  })

  afterAll(() => {
    vi.resetAllMocks()
  })

  it('should reset the session and navigate to home on successful logout', async () => {
    const navigate = vi.fn()
    mockedUseNavigate.mockReturnValue(navigate)

    const { click } = renderLogoutButton()

    await click(screen.getByRole('button', { name: /click here to logout/i }))

    await waitFor(() => {
      expect(resetSessionSpy).toHaveBeenCalled()
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
