import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi } from 'vitest';
import { ProfileDto } from '~shared/api/realworld';
import { renderWithClient } from '~shared/lib/react-query';
import { useMutationFollowUser } from '../../api/followUser';
import { FollowUserButton } from './FollowUserButton';

const newProfile: ProfileDto = {
  username: 'John Doe',
  bio: 'I work at statefarm',
  image: 'https://api.realworld.io/images/demo-avatar.png',
  following: true,
};

vi.mock('../../api/followUser', () => ({
  useMutationFollowUser: vi.fn(() => ({
    mutate: vi.fn().mockImplementation(() => {}),
  })),
}));

describe('<FollowUserButton />', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should render the button', () => {
    renderWithClient(<FollowUserButton profile={newProfile} />);

    const favoriteButton = screen.getByRole('button');
    expect(favoriteButton).toBeInTheDocument();
  });

  it('should call the profile API', async () => {
    renderWithClient(<FollowUserButton profile={newProfile} />);
    const favoriteButton = screen.getByRole('button');

    await userEvent.click(favoriteButton);

    expect(useMutationFollowUser).toHaveBeenCalledTimes(1);
  });
});
