import { IoAdd } from 'react-icons/io5';
import { useNavigate } from 'react-router-dom';
import { profileQueries, profileTypes } from '~entities/profile';
import { sessionModel } from '~entities/session';
import { pathKeys } from '~shared/lib/react-router';
import { Button } from '~shared/ui/button';

type FollowUserButtonProps = { profile: profileTypes.Profile };

export function FollowUserButton(props: FollowUserButtonProps) {
  const { profile } = props;

  const navigate = useNavigate();

  const { mutate: followProfile } = profileQueries.useFollowProfileMutation(
    profile.username,
  );

  const handleClick = () => {
    if (sessionModel.hasToken()) {
      followProfile({ username: profile.username });
      return;
    }
    navigate(pathKeys.login());
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
