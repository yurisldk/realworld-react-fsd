import { profileApi } from '~entities/profile';
import { FollowUserButton } from '../../../follow-profile';
import { UnfollowUserButton } from '../../../unfollow-profile';

type ToggleFollowButtonProps = {
  profile: profileApi.Profile;
};

export function ToggleFollowButton(props: ToggleFollowButtonProps) {
  const { profile } = props;

  return profile.following ? (
    <UnfollowUserButton profile={profile} />
  ) : (
    <FollowUserButton profile={profile} />
  );
}
