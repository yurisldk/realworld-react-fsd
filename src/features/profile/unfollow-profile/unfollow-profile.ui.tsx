import { IoRemove } from 'react-icons/io5';
import { profileQueries, profileTypes } from '~entities/profile';
import { Button } from '~shared/ui/button';

type UnfollowUserButtonProps = { profile: profileTypes.Profile };

export function UnfollowUserButton(props: UnfollowUserButtonProps) {
  const { profile } = props;

  const { mutate: unfollowProfile } =
    profileQueries.useUnfollowProfileMutation(profile);

  const handleClick = () => {
    unfollowProfile(profile.username);
  };

  return (
    <Button color="secondary" className="action-btn " onClick={handleClick}>
      <IoRemove size={16} />
      &nbsp; Unfollow {profile.username}
    </Button>
  );
}
