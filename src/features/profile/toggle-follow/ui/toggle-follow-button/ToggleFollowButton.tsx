import { profileApi } from '~entities/profile';
// FIXME: crossimport!
import { FollowUserButton } from '../../../follow';
import { UnfollowUserButton } from '../../../unfollow';

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
