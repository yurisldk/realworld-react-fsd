import { profileApi } from '~entities/profile';
import { FollowUserButton } from '../../../follow-profile';
import { UnfollowUserButton } from '../../../unfollow-profile';

type ToggleFollowButtonProps = {
  queryKey: unknown[];
  profile: profileApi.Profile;
};

export function ToggleFollowButton(props: ToggleFollowButtonProps) {
  const { queryKey, profile } = props;

  return profile.following ? (
    <UnfollowUserButton queryKey={queryKey} profile={profile} />
  ) : (
    <FollowUserButton queryKey={queryKey} profile={profile} />
  );
}
