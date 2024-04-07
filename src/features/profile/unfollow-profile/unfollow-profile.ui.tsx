import { IoRemove } from 'react-icons/io5';
import { useNavigate } from 'react-router-dom';
import { profileQueries, profileTypes } from '~entities/profile';
import { pathKeys } from '~shared/lib/react-router';
import { sessionService } from '~shared/session';
import { Button } from '~shared/ui/button';

type UnfollowUserButtonProps = { profile: profileTypes.Profile };

export function UnfollowUserButton(props: UnfollowUserButtonProps) {
  const { profile } = props;

  const navigate = useNavigate();

  const { mutate: unfollowProfile } = profileQueries.useUnfollowProfileMutation(
    profile.username,
  );

  const handleClick = () => {
    if (sessionService.hasToken()) {
      unfollowProfile({ username: profile.username });
      return;
    }
    navigate(pathKeys.login());
  };

  return (
    <Button color="secondary" className="action-btn " onClick={handleClick}>
      <IoRemove size={16} />
      &nbsp; Unfollow {profile.username}
    </Button>
  );
}
