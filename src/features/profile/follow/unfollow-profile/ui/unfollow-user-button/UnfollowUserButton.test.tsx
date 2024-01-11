import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi } from 'vitest';
import { profileApi } from '~entities/profile';
import { renderWithClient } from '~shared/lib/react-query';
import { useMutationUnfollowUser } from '../../api/unfollowUser';
import { UnfollowUserButton } from './UnfollowUserButton';

const newProfile: profileApi.Profile = {
  username: 'Anah Benešová',
  bio: 'I work at statefarm',
  image: 'https://api.realworld.io/images/demo-avatar.png',
  following: false,
};

vi.mock('../../api/unfollowUser', () => ({
  useMutationUnfollowUser: vi.fn(() => ({
    mutate: vi.fn().mockImplementation(() => {}),
  })),
}));

describe('<UnfollowUserButton />', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should render the button', () => {
    renderWithClient(<UnfollowUserButton profile={newProfile} />);

    const favoriteButton = screen.getByRole('button');
    expect(favoriteButton).toBeDefined();
  });

  it('should call the profile API', async () => {
    renderWithClient(<UnfollowUserButton profile={newProfile} />);
    const favoriteButton = screen.getByRole('button');

    await userEvent.click(favoriteButton);

    expect(useMutationUnfollowUser).toHaveBeenCalledTimes(1);
  });
});
