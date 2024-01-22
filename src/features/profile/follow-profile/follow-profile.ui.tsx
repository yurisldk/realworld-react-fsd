import { IoAdd } from 'react-icons/io5';
import { profileTypes } from '~entities/profile';
import { Button } from '~shared/ui/button';
import { useFollowProfileMutation } from './follow-profile.model';

type FollowUserButtonProps = { profile: profileTypes.Profile };

export function FollowUserButton(props: FollowUserButtonProps) {
  const { profile } = props;

  const { mutate: followProfile } = useFollowProfileMutation(profile);

  const handleClick = () => {
    followProfile(profile.username);
  };

  return (
    <Button color="secondary" variant="outline" onClick={handleClick}>
      <IoAdd size={16} />
      &nbsp; Follow {profile.username}
    </Button>
  );
}
