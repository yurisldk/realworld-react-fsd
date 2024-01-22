import { IoAdd } from 'react-icons/io5';
import { profileQueries, profileTypes } from '~entities/profile';
import { Button } from '~shared/ui/button';

type FollowUserButtonProps = { profile: profileTypes.Profile };

export function FollowUserButton(props: FollowUserButtonProps) {
  const { profile } = props;

  const { mutate: followProfile } = profileQueries.useFollowProfileMutation(
    profile.username,
  );

  const handleClick = () => {
    followProfile(profile.username);
  };

  return (
    <Button
      color="secondary"
      variant="outline"
      className="action-btn "
      onClick={handleClick}
    >
      <IoAdd size={16} />
      &nbsp; Follow {profile.username}
    </Button>
  );
}
