import { screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { BrowserRouter } from 'react-router-dom'
import { describe, expect, it, vi } from 'vitest'
import { ProfileService, profileTypesDto } from '~shared/api/profile'
import { AxiosLib } from '~shared/lib/axios'
import { renderWithQueryClient } from '~shared/lib/test'
import { profileTypes } from '~entities/profile'
import { FollowUserButton } from './follow-profile.ui'

describe('FollowUserButton Component', () => {
  it('should display the button with the correct text', () => {
    renderFollowUserButton()

    expect(
      screen.getByRole('button', { name: /follow testuser/i }),
    ).toBeInTheDocument()
  })

  it('should call the mutate function with the followed profile when clicked', async () => {
    const followProfileMutationSpy = vi
      .spyOn(ProfileService, 'followProfileMutation')
      .mockResolvedValue(AxiosLib.mockResolvedAxiosResponse(followedProfileDto))

    const { click } = renderFollowUserButton()

    await click(screen.getByRole('button', { name: /follow testuser/i }))

    await waitFor(() => {
      expect(followProfileMutationSpy).toHaveBeenCalledWith(profile.username)
    })
  })
})

const profile: profileTypes.Profile = {
  username: 'testuser',
  following: false,
  image: '',
  bio: 'bio',
}

const followedProfileDto: profileTypesDto.ProfileDto = {
  profile: {
    username: 'testuser',
    following: true,
    image: '',
    bio: 'bio',
  },
}

function renderFollowUserButton() {
  const user = userEvent.setup()
  const renderResult = renderWithQueryClient(
    <BrowserRouter>
      <FollowUserButton profile={profile} />
    </BrowserRouter>,
  )

  return { ...user, ...renderResult }
}
