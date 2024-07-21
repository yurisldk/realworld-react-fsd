import { screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { BrowserRouter } from 'react-router-dom'
import { describe, expect, it, vi } from 'vitest'
import { ProfileService, profileTypesDto } from '~shared/api/profile'
import { renderWithQueryClient } from '~shared/lib/test'
import { profileTypes } from '~entities/profile'
import { UnfollowUserButton } from './unfollow-profile.ui'

describe('UnfollowUserButton Component', () => {
  it('should display the button with the correct text', () => {
    renderUnfollowUserButton()

    expect(
      screen.getByRole('button', { name: /unfollow testuser/i }),
    ).toBeInTheDocument()
  })

  it('should call the mutate function with the unfollowed profile when clicked', async () => {
    const unfollowProfileMutationSpy = vi
      .spyOn(ProfileService, 'unfollowProfileMutation')
      .mockResolvedValue(unfollowedProfileDto)

    const { click } = renderUnfollowUserButton()

    await click(screen.getByRole('button', { name: /unfollow testuser/i }))

    await waitFor(() => {
      expect(unfollowProfileMutationSpy).toHaveBeenCalledWith({
        username: profile.username,
      })
    })
  })
})

const profile: profileTypes.Profile = {
  username: 'testuser',
  following: true,
  image: '',
  bio: 'bio',
}

const unfollowedProfileDto: profileTypesDto.ProfileDto = {
  profile: {
    username: 'testuser',
    following: false,
    image: '',
    bio: 'bio',
  },
}

function renderUnfollowUserButton() {
  const user = userEvent.setup()
  const renderResult = renderWithQueryClient(
    <BrowserRouter>
      <UnfollowUserButton profile={profile} />
    </BrowserRouter>,
  )

  return { ...user, ...renderResult }
}
